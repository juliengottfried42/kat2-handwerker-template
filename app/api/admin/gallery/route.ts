import { NextRequest, NextResponse } from "next/server";
import { upsertGalleryItem, deleteGalleryItem } from "@/lib/queries";
import { requireAdminApi } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

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
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await req.json();
    await deleteGalleryItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("deleteGalleryItem error:", error);
    return NextResponse.json({ error: "Löschen fehlgeschlagen." }, { status: 500 });
  }
}
