"use client";

import { useState } from "react";

export default function CarFigure({ label, file }) {
  const [on, setOn] = useState(false);

  return (
    <figure
      className={`car car-${file}${on ? " is-on" : ""}`}
      tabIndex={0}
      aria-label={`${label}. Hover or focus to face the vehicle.`}
      onClick={() => setOn((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOn((v) => !v);
        }
      }}
      onBlur={() => setOn(false)}
    >
      <img
        src={`/cars/${file}-threequarter.png?v=10`}
        alt=""
        className="view view-3q"
        width={1920}
        height={1080}
        draggable="false"
      />
      <img
        src={`/cars/${file}-front.png?v=10`}
        alt=""
        className="view view-front"
        width={1920}
        height={1080}
        draggable="false"
      />
      <figcaption className="car-caption">
        <span className="car-name">{label}</span>
      </figcaption>
    </figure>
  );
}
