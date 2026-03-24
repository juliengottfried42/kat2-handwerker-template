import { NextRequest, NextResponse } from "next/server";
import { createInquiry, updateInquiry } from "@/lib/queries";
import { sendInquiryConfirmation, sendInquiryNotification } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, message, answers, photos, preferred_date } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Name, Telefon und E-Mail sind Pflichtfelder." }, { status: 400 });
    }

    const inquiry = await createInquiry({
      name,
      phone,
      email,
      message,
      answers: answers ?? {},
      photos: photos ?? [],
      preferred_date,
    });

    // Send emails (fire and forget — don't block response)
    Promise.all([
      sendInquiryConfirmation(email, { name, answers, preferredDate: preferred_date }),
      sendInquiryNotification({ name, phone, email, message, answers, photos, preferredDate: preferred_date }),
    ]).catch(console.error);

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Anfrage konnte nicht gespeichert werden." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, notes } = await req.json();
    if (!id) return NextResponse.json({ error: "ID fehlt." }, { status: 400 });
    const VALID_STATUSES = ["neu", "beantwortet", "erledigt"];
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status." }, { status: 400 });
    }
    await updateInquiry(id, { status, notes });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update fehlgeschlagen." }, { status: 500 });
  }
}
