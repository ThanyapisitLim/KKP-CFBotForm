// Admin-session helper for the /dashboard area.
//
// Credentials live in MongoDB (collection `admin_users`, managed by the
// backend). This module verifies username/password against the backend's
// POST /api/admin/login endpoint, then issues a session cookie.
//
// The session cookie value is `${username}.${hmac}`, where `hmac` is an
// HMAC-SHA256 of the username, signed with AUTH_SECRET. This avoids needing
// server-side session storage while still preventing forged cookies (the
// value can't be guessed without the secret).

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const ADMIN_SESSION_COOKIE = "cf_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verifies a username/password pair against the backend's admin user
 * collection (POST /api/admin/login). Returns true if valid.
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    return res.ok;
  } catch (err) {
    console.error("[auth] Failed to reach backend for admin login", err);
    return false;
  }
}

/**
 * Builds a signed session token for the given username.
 * Returns null if the server isn't configured (missing AUTH_SECRET).
 */
export async function createSessionToken(username: string): Promise<string | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const signature = await hmacSha256Hex(secret, username);
  return `${username}.${signature}`;
}

/**
 * Validates a session cookie value (`${username}.${hmac}`) by recomputing
 * the HMAC for the embedded username and comparing it to the signature.
 */
export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) return false;

  const username = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);

  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  const expected = await hmacSha256Hex(secret, username);
  return signature === expected;
}
