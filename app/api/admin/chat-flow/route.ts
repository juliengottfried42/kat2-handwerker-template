import { NextRequest, NextResponse } from "next/server";
import { upsertChatStep, deleteChatStep } from "@/lib/queries";
import { requireAdminApi } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = await req.json();
    const step = await upsertChatStep(body);
    return NextResponse.json(step);
  } catch (error) {
    console.error("upsertChatStep error:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await req.json();
    await deleteChatStep(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("deleteChatStep error:", error);
    return NextResponse.json({ error: "Löschen fehlgeschlagen." }, { status: 500 });
  }
}
