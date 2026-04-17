import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, adminLogin, adminLogout, isAdminAuthEnabled } from "@/lib/admin-auth";

// TODO(security): Add rate limiting to this login endpoint to prevent brute-force
//   attacks against the admin password. Currently unlimited login attempts are possible.
//   Recommended: 5 attempts per IP per 15 minutes.
export async function POST(req: NextRequest) {
  if (!isAdminAuthEnabled()) {
    return NextResponse.json(
      { error: "Admin-Authentifizierung ist nicht konfiguriert. Setze ADMIN_PASSWORD_HASH in .env.local." },
      { status: 400 }
    );
  }

  try {
    const { password } = await req.json();

    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
    }

    await adminLogin();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Anmeldung fehlgeschlagen." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await adminLogout();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ error: "Abmeldung fehlgeschlagen." }, { status: 500 });
  }
}
