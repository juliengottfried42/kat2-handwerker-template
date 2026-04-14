import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createInquiry, updateInquiry } from "@/lib/queries";
import { sendInquiryConfirmation, sendInquiryNotification } from "@/lib/resend";
import { requireAdminApi } from "@/lib/admin-auth";

const inquirySchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(5).max(30),
  email: z.string().email(),
  message: z.string().max(5000).optional(),
  answers: z.record(z.string(), z.string()).optional(),
  photos: z.array(z.string().url()).max(20).optional(),
  preferred_date: z.string().optional(),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es spaeter erneut." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungueltige Eingabe.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, email, message, answers, photos, preferred_date } = parsed.data;
    const safeAnswers = answers ?? {};
    const safePhotos = photos ?? [];

    const inquiry = await createInquiry({
      name,
      phone,
      email,
      message: message ?? null,
      answers: safeAnswers,
      photos: safePhotos,
      preferred_date: preferred_date ?? null,
    });

    // Send emails (fire and forget — don't block response)
    Promise.all([
      sendInquiryConfirmation(email, { name, answers: safeAnswers, preferredDate: preferred_date }),
      sendInquiryNotification({ name, phone, email, message, answers: safeAnswers, photos: safePhotos, preferredDate: preferred_date }),
    ]).catch(console.error);

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Anfrage konnte nicht gespeichert werden." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // Security: require admin authentication for updating inquiries
  const authError = await requireAdminApi();
  if (authError) return authError;

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
