import { Resend } from "resend";
import { render } from "@react-email/render";
import InquiryConfirmation from "@/emails/inquiry-confirmation";
import InquiryNotification from "@/emails/inquiry-notification";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendInquiryConfirmation(to: string, data: {
  name: string;
  answers: Record<string, string>;
  preferredDate?: string;
}) {
  const component = InquiryConfirmation({
    name: data.name,
    answers: data.answers,
    preferredDate: data.preferredDate,
  });

  const html = await render(component);
  const text = await render(component, { plainText: true });

  const { error } = await getResend().emails.send({
    from: `Anfrage <${process.env.FROM_EMAIL ?? "noreply@example.com"}>`,
    to,
    subject: "Ihre Anfrage ist eingegangen",
    html,
    text,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
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
  const recipientEmail = process.env.RECIPIENT_EMAIL;
  if (!recipientEmail) throw new Error("RECIPIENT_EMAIL environment variable is not set");

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

  const { error } = await getResend().emails.send({
    from: `Website <${process.env.FROM_EMAIL ?? "noreply@example.com"}>`,
    to: recipientEmail,
    subject: `Neue Anfrage von ${data.name}`,
    html,
    text,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
