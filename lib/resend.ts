import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryConfirmation(to: string, data: {
  name: string;
  answers: Record<string, string>;
  preferredDate?: string;
}) {
  await resend.emails.send({
    from: "Anfrage <noreply@gottfriedmedia.ch>",
    to,
    subject: "Ihre Anfrage ist eingegangen",
    html: `
      <h2>Danke für Ihre Anfrage, ${data.name}!</h2>
      <p>Wir haben Ihre Anfrage erhalten und melden uns innert 24 Stunden.</p>
      <h3>Ihre Angaben:</h3>
      <ul>${Object.entries(data.answers).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>
      ${data.preferredDate ? `<p><strong>Wunschtermin:</strong> ${data.preferredDate}</p>` : ""}
    `,
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
  await resend.emails.send({
    from: "Website <noreply@gottfriedmedia.ch>",
    to: recipientEmail,
    subject: `Neue Anfrage von ${data.name}`,
    html: `
      <h2>Neue Anfrage</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Telefon:</strong> ${data.phone}</p>
      <p><strong>E-Mail:</strong> ${data.email}</p>
      ${data.message ? `<p><strong>Nachricht:</strong> ${data.message}</p>` : ""}
      ${data.preferredDate ? `<p><strong>Wunschtermin:</strong> ${data.preferredDate}</p>` : ""}
      <h3>Antworten:</h3>
      <ul>${Object.entries(data.answers).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>
      ${data.photos.length > 0 ? `<h3>Fotos:</h3>${data.photos.map((url) => `<p><a href="${url}">${url}</a></p>`).join("")}` : ""}
    `,
  });
}
