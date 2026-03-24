import { Resend } from "resend";
import { render } from "@react-email/render";
import InquiryConfirmation from "@/emails/inquiry-confirmation";
import InquiryNotification from "@/emails/inquiry-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryConfirmation(to: string, data: {
  name: string;
  answers: Record<string, string>;
  preferredDate?: string;
}) {
  const html = await render(
    InquiryConfirmation({
      name: data.name,
      answers: data.answers,
      preferredDate: data.preferredDate,
    })
  );

  await resend.emails.send({
    from: "Anfrage <noreply@gottfriedmedia.ch>",
    to,
    subject: "Ihre Anfrage ist eingegangen",
    html,
  });
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
  const recipientEmail = process.env.RECIPIENT_EMAIL!;

  const html = await render(
    InquiryNotification({
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      answers: data.answers,
      photos: data.photos,
      preferredDate: data.preferredDate,
    })
  );

  await resend.emails.send({
    from: "Website <noreply@gottfriedmedia.ch>",
    to: recipientEmail,
    subject: `Neue Anfrage von ${data.name}`,
    html,
  });
}
