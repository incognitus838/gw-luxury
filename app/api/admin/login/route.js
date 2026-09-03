import { NextResponse } from "next/server";
import {
  adminConfigured,
  checkPassword,
  cookieOptions,
  ADMIN_COOKIE,
  signAdminToken,
} from "../../../lib/adminAuth";

const attempts = new Map();

function clientKey(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function rateLimited(key) {
  const now = Date.now();
  const row = attempts.get(key) || { n: 0, t: now };
  if (now - row.t > 15 * 60 * 1000) {
    attempts.set(key, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  attempts.set(key, row);
  return row.n > 12;
}

export async function POST(request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin password is not configured." },
      { status: 503 }
    );
  }
  const key = clientKey(request);
  if (rateLimited(key)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Wait and try again." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!checkPassword(String(body.password ?? ""))) {
    return NextResponse.json(
      { ok: false, error: "Wrong password." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signAdminToken(), cookieOptions());
  return res;
}
