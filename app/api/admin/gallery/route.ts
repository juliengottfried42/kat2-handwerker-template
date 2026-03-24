import { NextRequest, NextResponse } from "next/server";
import { upsertGalleryItem, deleteGalleryItem } from "@/lib/queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await upsertGalleryItem(body);
    return NextResponse.json(item);
  } catch (error) {
    console.error("upsertGalleryItem error:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteGalleryItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("deleteGalleryItem error:", error);
    return NextResponse.json({ error: "Löschen fehlgeschlagen." }, { status: 500 });
  }
}
