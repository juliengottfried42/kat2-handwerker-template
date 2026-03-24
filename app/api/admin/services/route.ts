import { NextRequest, NextResponse } from "next/server";
import { upsertService, deleteService } from "@/lib/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = await upsertService(body);
    return NextResponse.json(service);
  } catch (error) {
    console.error("upsertService error:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteService(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("deleteService error:", error);
    return NextResponse.json({ error: "Löschen fehlgeschlagen." }, { status: 500 });
  }
}
