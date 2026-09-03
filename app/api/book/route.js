import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { AREAS, fleet, formatNaira } from "../../lib/fleet";

const STORE = path.join(
  process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data"),
  "bookings.json"
);
const AREA_IDS = new Set(AREAS.map((a) => a.value));
const CAR_IDS = new Set(fleet.map((c) => c.id));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function validate(body) {
  const errors = {};
  const carId = String(body.carId ?? "");
  const duration = String(body.duration ?? "");
  const area = String(body.area ?? "");
  const pickup = String(body.pickup ?? "").trim();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!CAR_IDS.has(carId)) errors.carId = "Choose a vehicle.";
  if (duration !== "12" && duration !== "24") {
    errors.duration = "Choose 12 or 24 hours.";
  }
  if (!AREA_IDS.has(area)) errors.area = "Choose an area of use.";
  if (pickup.length < 8) errors.pickup = "Enter a pickup address.";
  if (name.length < 2) errors.name = "Enter your name.";
  const phoneDigits = digits(phone);
  if (phoneDigits.length < 10 || phoneDigits.length > 14) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email.";

  return {
    errors,
    data: { carId, duration, area, pickup, name, phone, email },
  };
}

async function loadBookings() {
  try {
    const raw = await readFile(STORE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const { errors, data } = validate(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const car = fleet.find((c) => c.id === data.carId);
  const area = AREAS.find((a) => a.value === data.area);
  const id = `GW-${Date.now().toString(36).toUpperCase()}`;

  const booking = {
    id,
    ...data,
    vehicle: `${car.name}${car.year ? ` ${car.year}` : ""}`,
    rate12: car.rate12,
    rateLabel: formatNaira(car.rate12),
    areaLabel: area.label,
    includes: ["chauffeur", "fuel", "pickup"],
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await mkdir(path.dirname(STORE), { recursive: true });
  const existing = await loadBookings();
  existing.push(booking);
  await writeFile(STORE, JSON.stringify(existing, null, 2), "utf8");

  return NextResponse.json({ ok: true, id, booking });
}
