import { NextResponse } from "next/server";
import { appendBooking } from "../../lib/bookings";
import { AREAS, fleet, formatNaira } from "../../lib/fleet";

const AREA_IDS = new Set(AREAS.map((a) => a.value));
const CAR_IDS = new Set(fleet.map((c) => c.id));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DURATIONS = new Set(["12", "24", "enterprise"]);

function utcToday() {
  return new Date().toISOString().slice(0, 10);
}

function validate(body) {
  const errors = {};
  const carId = String(body.carId ?? "");
  const neededOn = String(body.neededOn ?? "").trim();
  const duration = String(body.duration ?? "");
  const area = String(body.area ?? "");
  const pickup = String(body.pickup ?? "").trim();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const additionalInfo = String(body.additionalInfo ?? "").trim().slice(0, 2000);
  let days = null;

  if (!CAR_IDS.has(carId)) errors.carId = "Choose a vehicle.";
  if (!DATE_RE.test(neededOn) || Number.isNaN(Date.parse(`${neededOn}T00:00:00Z`))) {
    errors.neededOn = "Choose the date the vehicle is needed.";
  } else {
    const floor = new Date(`${utcToday()}T00:00:00Z`);
    floor.setUTCDate(floor.getUTCDate() - 1);
    const picked = new Date(`${neededOn}T00:00:00Z`);
    if (picked < floor) errors.neededOn = "Choose today or a future date.";
  }
  if (!DURATIONS.has(duration)) {
    errors.duration = "Choose 12 hours, 24 hours, or enterprise.";
  }
  if (duration === "enterprise") {
    const n = Number.parseInt(String(body.days ?? ""), 10);
    if (!Number.isInteger(n) || n < 2 || n > 90) {
      errors.days = "Enter between 2 and 90 days.";
    } else {
      days = n;
    }
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
    data: {
      carId,
      neededOn,
      duration,
      days,
      area,
      pickup,
      name,
      phone,
      email,
      additionalInfo,
    },
  };
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

  const durationLabel =
    data.duration === "enterprise"
      ? `Enterprise · ${data.days} days`
      : `${data.duration} hours`;

  const booking = {
    id,
    ...data,
    vehicle: `${car.name}${car.year ? ` ${car.year}` : ""}`,
    rate12: car.rate12,
    rateLabel: formatNaira(car.rate12),
    durationLabel,
    areaLabel: area.label,
    includes: ["chauffeur", "fuel", "pickup"],
    status: "pending",
    houseNote: "",
    createdAt: new Date().toISOString(),
  };

  const saved = await appendBooking(booking);
  return NextResponse.json({ ok: true, id, booking: saved });
}
