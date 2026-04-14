import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi } from "@/lib/admin-auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: NextRequest) {
  // Security: require admin authentication for file uploads
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Datei zu gross (max. 5 MB)." }, { status: 400 });
    }

    // Security: validate file type to prevent uploading executable/malicious files
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Dateityp nicht erlaubt. Nur Bilder (JPEG, PNG, WebP, AVIF, GIF, SVG)." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin()
      .storage
      .from("photos")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) throw error;

    const { data } = supabaseAdmin()
      .storage
      .from("photos")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }
}
