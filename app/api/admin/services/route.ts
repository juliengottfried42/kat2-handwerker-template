import { NextRequest, NextResponse } from "next/server";
import { upsertService, deleteService } from "@/lib/queries";
import { requireAdminApi } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

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
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await req.json();
    await deleteService(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("deleteService error:", error);
    return NextResponse.json({ error: "Löschen fehlgeschlagen." }, { status: 500 });
  }
}
