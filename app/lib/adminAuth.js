import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "gw_admin";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== "production") return "orangered";
  return "";
}

export function adminConfigured() {
  return Boolean(getAdminPassword());
}

function hmac(value) {
  return createHmac("sha256", getAdminPassword()).update(value).digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function checkPassword(input) {
  const expected = getAdminPassword();
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function signAdminToken() {
  const exp = Date.now() + TTL_MS;
  const payload = String(exp);
  return `${payload}.${hmac(payload)}`;
}

export function verifyAdminToken(token) {
  if (!token || !getAdminPassword()) return false;
  const [payload, sig] = String(token).split(".");
  if (!payload || !sig) return false;
  if (Number(payload) < Date.now()) return false;
  return safeEqual(sig, hmac(payload));
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  };
}
