import { NextRequest, NextResponse } from "next/server";
import { upsertChatStep, deleteChatStep } from "@/lib/queries";

export async function POST(req: NextRequest) {
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
  try {
    const { id } = await req.json();
    await deleteChatStep(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("deleteChatStep error:", error);
    return NextResponse.json({ error: "Löschen fehlgeschlagen." }, { status: 500 });
  }
}
