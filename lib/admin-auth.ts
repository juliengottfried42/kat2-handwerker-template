import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/**
 * Hash a password with SHA-256 (for comparing against ADMIN_PASSWORD_HASH env var).
 * To generate a hash for .env: node -e "console.log(require('crypto').createHash('sha256').update('yourpassword').digest('hex'))"
 *
 * TODO(security): SHA-256 is a fast hash, not a password hash. Brute-force attacks
 *   are feasible. Consider migrating to bcrypt or scrypt for password hashing.
 *   The timingSafeEqual in verifyPassword is correct (prevents timing attacks), but
 *   the underlying hash algorithm should be upgraded. Low priority since this is
 *   a single admin password, not user-facing auth.
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Create a signed session token.
 */
function createSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verify the admin password against the stored hash.
 */
export function verifyPassword(password: string): boolean {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) {
    // If no hash is configured, admin auth is disabled (development/demo mode)
    return false;
  }
  const inputHash = hashPassword(password);
  return crypto.timingSafeEqual(
    Buffer.from(inputHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

/**
 * Check if admin auth is enabled (ADMIN_PASSWORD_HASH is set).
 */
export function isAdminAuthEnabled(): boolean {
  return !!process.env.ADMIN_PASSWORD_HASH;
}

// In-memory session store (resets on server restart — sufficient for single-instance template)
const validSessions = new Set<string>();

/**
 * Log in: set session cookie. Call from a Route Handler or Server Action.
 */
export async function adminLogin(): Promise<string> {
  const token = createSessionToken();
  validSessions.add(token);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return token;
}

/**
 * Log out: clear session cookie.
 */
export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    validSessions.delete(token);
  }
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Check if the current request has a valid admin session.
 * Use in Server Components and Route Handlers.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminAuthEnabled()) {
    // Auth disabled — allow access (demo/development mode)
    return true;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return validSessions.has(token);
}

/**
 * Require admin auth in a Server Component. Redirects to login if not authenticated.
 */
export async function requireAdmin(): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

/**
 * Require admin auth in an API Route Handler. Returns 401 response if not authenticated.
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  if (!isAdminAuthEnabled()) {
    return null; // Auth disabled, allow through
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !validSessions.has(token)) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }
  return null; // Authenticated, allow through
}
