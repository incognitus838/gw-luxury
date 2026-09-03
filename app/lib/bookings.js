import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { STATUSES } from "./bookingMeta";

export { STATUSES };

const STORE = path.join(
  process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data"),
  "bookings.json"
);

const STATUS_SET = new Set(STATUSES);

let writeChain = Promise.resolve();

function withLock(fn) {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function durationLabelOf(row) {
  if (row.durationLabel) return row.durationLabel;
  if (row.duration === "enterprise") {
    return `Enterprise · ${row.days ?? "—"} days`;
  }
  if (row.duration) return `${row.duration} hours`;
  return "—";
}

export function normalizeBooking(row) {
  const status = STATUS_SET.has(row?.status) ? row.status : "pending";
  return {
    ...row,
    neededOn: row?.neededOn || "",
    days: row?.days ?? null,
    additionalInfo: row?.additionalInfo || "",
    houseNote: String(row?.houseNote ?? ""),
    status,
    durationLabel: durationLabelOf(row || {}),
  };
}

export function sortBookings(list) {
  return [...list].sort((a, b) => {
    const da = a.neededOn || "9999-99-99";
    const db = b.neededOn || "9999-99-99";
    if (da !== db) return da.localeCompare(db);
    return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
  });
}

export async function loadBookings() {
  try {
    const raw = await readFile(STORE, "utf8");
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    return sortBookings(list.map(normalizeBooking));
  } catch {
    return [];
  }
}

async function persist(list) {
  await mkdir(path.dirname(STORE), { recursive: true });
  await writeFile(STORE, JSON.stringify(list, null, 2), "utf8");
}

export async function appendBooking(booking) {
  return withLock(async () => {
    const existing = await loadBookings();
    const row = normalizeBooking({
      ...booking,
      status: booking.status || "pending",
      houseNote: booking.houseNote || "",
    });
    existing.push(row);
    await persist(existing);
    return row;
  });
}

export async function patchBooking(id, patch) {
  return withLock(async () => {
    const existing = await loadBookings();
    const index = existing.findIndex((b) => b.id === id);
    if (index < 0) return null;
    const next = normalizeBooking({ ...existing[index] });
    if (patch.status != null) {
      if (!STATUS_SET.has(patch.status)) {
        const err = new Error("Invalid status.");
        err.code = "invalid_status";
        throw err;
      }
      next.status = patch.status;
    }
    if (patch.houseNote != null) {
      next.houseNote = String(patch.houseNote).slice(0, 500);
    }
    existing[index] = next;
    await persist(existing);
    return next;
  });
}
