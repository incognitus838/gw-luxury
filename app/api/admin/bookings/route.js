import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadBookings, patchBooking } from "../../../lib/bookings";
import { ADMIN_COOKIE, verifyAdminToken } from "../../../lib/adminAuth";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

function isAuthed() {
  return verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value);
}

export async function GET() {
  if (!isAuthed()) return unauthorized();
  const bookings = await loadBookings();
  return NextResponse.json({ ok: true, bookings });
}

export async function PATCH(request) {
  if (!isAuthed()) return unauthorized();
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const id = String(body.id ?? "");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  }

  try {
    const booking = await patchBooking(id, {
      status: body.status,
      houseNote: body.houseNote,
    });
    if (!booking) {
      return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking });
  } catch (err) {
    if (err.code === "invalid_status") {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    throw err;
  }
}
