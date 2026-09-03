"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES } from "../lib/bookingMeta";

const FILTERS = ["all", ...STATUSES];

function telHref(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `tel:+234${digits.replace(/^0/, "")}` : "";
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function durationOf(row) {
  if (row.duration === "enterprise") {
    return `${row.days || "—"} days`;
  }
  return row.durationLabel || (row.duration ? `${row.duration} h` : "—");
}

export default function Inbox({ initial }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const next = { all: rows.length };
    for (const s of STATUSES) next[s] = rows.filter((r) => r.status === s).length;
    return next;
  }, [rows]);

  const visible = rows.filter((r) => filter === "all" || r.status === filter);

  async function patch(id, body) {
    setError("");
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) {
      setError(payload.error || "Could not save.");
      return null;
    }
    setRows((list) => list.map((r) => (r.id === id ? payload.booking : r)));
    return payload.booking;
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="page site admin-page">
      <header className="admin-bar">
        <p className="hp-kicker">House</p>
        <h1 className="hp-section-title">Inbox.</h1>
        <button type="button" className="admin-signout" onClick={signOut}>
          Sign out
        </button>
      </header>

      <p className="admin-count">{counts.all} request{counts.all === 1 ? "" : "s"}</p>

      <div className="admin-filters" role="tablist" aria-label="Status">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={filter === f ? "is-on" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
            <em>{counts[f] ?? 0}</em>
          </button>
        ))}
      </div>

      {error ? (
        <p className="book-err" role="alert">
          {error}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <p className="admin-empty">No requests in this view.</p>
      ) : (
        <ul className="admin-list">
          {visible.map((row) => (
            <li key={row.id} className={`admin-row is-${row.status}`}>
              <div className="admin-row-top">
                <strong>{row.id}</strong>
                <span>{formatDate(row.neededOn)}</span>
                <span>{durationOf(row)}</span>
              </div>
              <p className="admin-vehicle">{row.vehicle || row.carId}</p>
              <p className="admin-guest">
                {row.name}
                {row.areaLabel ? ` · ${row.areaLabel}` : ""}
              </p>
              <p className="admin-pickup">{row.pickup}</p>
              <div className="admin-links">
                {telHref(row.phone) ? (
                  <a href={telHref(row.phone)}>{row.phone}</a>
                ) : (
                  <span>{row.phone || "—"}</span>
                )}
                {row.email ? (
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                ) : null}
              </div>
              {row.additionalInfo ? (
                <p className="admin-notes">{row.additionalInfo}</p>
              ) : null}
              <div className="admin-ops">
                <label>
                  <span>Status</span>
                  <select
                    value={row.status}
                    onChange={(e) => patch(row.id, { status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-house">
                  <span>House note</span>
                  <input
                    type="text"
                    defaultValue={row.houseNote}
                    maxLength={500}
                    placeholder="Quote, chauffeur, waiting on yes"
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value === (row.houseNote || "")) return;
                      patch(row.id, { houseNote: value });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
