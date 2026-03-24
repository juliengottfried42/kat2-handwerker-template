import { NextRequest, NextResponse } from "next/server";
import { updateSiteConfig } from "@/lib/queries";

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();
    const config = await updateSiteConfig(key, value);
    return NextResponse.json(config);
  } catch (error) {
    console.error("updateSiteConfig error:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
