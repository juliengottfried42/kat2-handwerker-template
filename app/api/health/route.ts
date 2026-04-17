import { NextResponse } from "next/server";

// Security: Health endpoint returns only status, not service-level details.
// Detailed diagnostics should be behind admin auth.

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
