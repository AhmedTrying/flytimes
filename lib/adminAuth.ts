import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "flytimes_admin";

/**
 * Build the cookie value used to mark a session as admin-authenticated.
 * It's an HMAC of the password — short, deterministic, and cannot be forged
 * without knowing the password. Validity = "value matches the current password".
 */
export function adminCookieValue(password: string): string {
  return createHmac("sha256", password).update("flytimes-admin").digest("hex");
}

/**
 * Whether the current request carries a valid admin cookie.
 * Server-side only.
 */
export function isAdminAuthed(): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === "change-me-in-production") {
    // No password configured → admin is locked. Never allow access.
    return false;
  }
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  if (!cookie) return false;
  const expected = adminCookieValue(password);
  // Constant-time compare
  try {
    const a = Buffer.from(cookie, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Same check but reading the cookie directly from a Request — used by
 * middleware where `cookies()` is not available.
 */
export function isAdminAuthedFromCookie(cookieValue: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === "change-me-in-production") return false;
  if (!cookieValue) return false;
  const expected = adminCookieValue(password);
  try {
    const a = Buffer.from(cookieValue, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
