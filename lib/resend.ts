import { Resend } from "resend";
import { render } from "@react-email/render";
import InquiryConfirmation from "@/emails/inquiry-confirmation";
import InquiryNotification from "@/emails/inquiry-notification";

let _resend: Resend | null = null;
export const isResendConfigured = !!process.env.RESEND_API_KEY;

function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

async function sendWithRetry(
  fn: () => Promise<{ error: { message: string } | null }>,
  label: string,
  maxAttempts = 3,
) {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { error } = await fn();
      if (!error) return;
      const msg = error.message || "";
      const isAuthError = /401|403|invalid api key|unauthori/i.test(msg);
      if (isAuthError) throw new Error(`Resend auth error (${label}): ${msg}`);
      lastErr = new Error(`Resend error (${label}): ${msg}`);
    } catch (err) {
      lastErr = err;
      if (err instanceof Error && /auth/i.test(err.message)) throw err;
    }
    if (attempt < maxAttempts) {
      const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr ?? new Error(`Resend failed after ${maxAttempts} attempts (${label})`);
}

export async function sendInquiryConfirmation(to: string, data: {
  name: string;
  answers: Record<string, string>;
  preferredDate?: string;
}) {
  if (!isResendConfigured) {
    console.warn("[resend] skipped confirmation (not configured)");
    return;
  }
  const component = InquiryConfirmation({
    name: data.name,
    answers: data.answers,
    preferredDate: data.preferredDate,
  });

  const html = await render(component);
  const text = await render(component, { plainText: true });

  await sendWithRetry(
    () =>
      getResend().emails.send({
        from: `Anfrage <${process.env.FROM_EMAIL ?? "noreply@example.com"}>`,
        to,
        subject: "Ihre Anfrage ist eingegangen",
        html,
        text,
      }),
    "confirmation",
  );
}

export async function sendInquiryNotification(data: {
  name: string;
  phone: string;
  email: string;
  message?: string;
  answers: Record<string, string>;
  photos: string[];
  preferredDate?: string;
}) {
  if (!isResendConfigured) {
    console.warn("[resend] skipped notification (not configured)");
    return;
  }
  const recipientEmail = process.env.RECIPIENT_EMAIL;
  if (!recipientEmail) {
    console.warn("[resend] RECIPIENT_EMAIL not set, skipping notification");
    return;
  }

  const component = InquiryNotification({
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    answers: data.answers,
    photos: data.photos,
    preferredDate: data.preferredDate,
  });

  const html = await render(component);
  const text = await render(component, { plainText: true });

  await sendWithRetry(
    () =>
      getResend().emails.send({
        from: `Website <${process.env.FROM_EMAIL ?? "noreply@example.com"}>`,
        to: recipientEmail,
        subject: `Neue Anfrage von ${data.name}`,
        html,
        text,
      }),
    "notification",
  );
}
