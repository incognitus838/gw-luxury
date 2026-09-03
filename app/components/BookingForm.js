"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AREAS, fleet, formatNaira, getCar } from "../lib/fleet";

const empty = {
  carId: "gwagon",
  duration: "12",
  area: "island",
  pickup: "",
  phone: "",
  email: "",
  name: "",
};

export default function BookingForm() {
  const params = useSearchParams();
  const preset = params.get("car");
  const [form, setForm] = useState(() => ({
    ...empty,
    carId: fleet.some((c) => c.id === preset) ? preset : "gwagon",
  }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [ref, setRef] = useState("");

  const car = getCar(form.carId);
  const pradoAreaNote =
    car.id === "prado" && form.area !== "island" && form.area !== "airport";

  const quote = useMemo(() => {
    if (form.duration === "24") return "24-hour rate confirmed after request";
    return `${formatNaira(car.rate12)} / 12 hours`;
  }, [car, form.duration]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    setErrors({});
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) {
        setErrors(payload.errors ?? {});
        setStatus("error");
        return;
      }
      setRef(payload.id);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="book-success" role="status">
        <p className="book-rate">Request received</p>
        <p className="book-note">{ref}</p>
        <p className="book-sent">
          {car.short}
          {car.year ? ` ${car.year}` : ""} · {form.duration} hours · {quote}.
          Chauffeur and fuel included. We will confirm and send the car to your
          pickup address.
        </p>
      </div>
    );
  }

  return (
    <form className="book-form" onSubmit={onSubmit}>
      <div className="book-grid">
        <label className="book-field book-field--full">
          <span>Vehicle</span>
          <select
            value={form.carId}
            onChange={(e) => update("carId", e.target.value)}
            required
          >
            {fleet.map((c) => (
              <option key={c.id} value={c.id}>
                {c.short}
                {c.year ? ` ${c.year}` : ""}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="book-field">
          <legend>Duration</legend>
          <div className="book-pills">
            {["12", "24"].map((h) => (
              <label key={h} className={form.duration === h ? "is-on" : ""}>
                <input
                  type="radio"
                  name="duration"
                  value={h}
                  checked={form.duration === h}
                  onChange={() => update("duration", h)}
                />
                {h} hours
              </label>
            ))}
          </div>
        </fieldset>

        <label className="book-field">
          <span>Area of use</span>
          <select
            value={form.area}
            onChange={(e) => update("area", e.target.value)}
            required
          >
            {AREAS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>

        <label className="book-field book-field--full">
          <span>Pickup address</span>
          <input
            type="text"
            value={form.pickup}
            onChange={(e) => update("pickup", e.target.value)}
            placeholder="Street address"
            required
            autoComplete="street-address"
          />
          {errors.pickup ? <em className="book-err">{errors.pickup}</em> : null}
        </label>

        <label className="book-field">
          <span>Your name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            autoComplete="name"
          />
          {errors.name ? <em className="book-err">{errors.name}</em> : null}
        </label>

        <label className="book-field">
          <span>Phone number</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="0800 000 0000"
            required
            autoComplete="tel"
          />
          {errors.phone ? <em className="book-err">{errors.phone}</em> : null}
        </label>

        <label className="book-field book-field--full">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            autoComplete="email"
          />
          {errors.email ? <em className="book-err">{errors.email}</em> : null}
        </label>
      </div>

      <aside className="book-aside">
        <p className="book-rate">
          {formatNaira(car.rate12)}
          <span> / 12 hours</span>
        </p>
        {car.note ? <p className="book-note">{car.note}</p> : null}
        <ul className="book-includes">
          <li>Chauffeur included</li>
          <li>Fuel included</li>
          <li>Pickup at your address</li>
        </ul>
        {form.duration === "24" ? (
          <p className="book-warn">
            Published rates are for 12 hours. We will confirm the 24-hour rate
            after this request.
          </p>
        ) : null}
        {pradoAreaNote ? (
          <p className="book-warn">
            Prado {formatNaira(150_000)} is Island &amp; Airport. Mainland and
            other areas are confirmed after your request.
          </p>
        ) : null}
        <button
          type="submit"
          className="book-submit"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Sending…" : "Send booking request"}
        </button>
        {status === "error" ? (
          <p className="book-sent" role="alert">
            Could not send. Check the form and try again.
          </p>
        ) : null}
      </aside>
    </form>
  );
}
