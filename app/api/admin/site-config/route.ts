import { NextRequest, NextResponse } from "next/server";
import { updateSiteConfig } from "@/lib/queries";
import { requireAdminApi } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { key, value } = await req.json();
    const config = await updateSiteConfig(key, value);
    return NextResponse.json(config);
  } catch (error) {
    console.error("updateSiteConfig error:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
