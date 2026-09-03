import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CarFigure from "../components/CarFigure";
import { fleet, formatNaira } from "../lib/fleet";
import "./collection.css";

export const metadata = {
  title: "GW Luxury · The Fleet",
  description:
    "G-Wagon 2022, Escalade, and Prado 2020. Chauffeur and fuel included. 12-hour rates.",
};

export default function CollectionPage() {
  return (
    <main className="page site fleet-page">
      <Nav />
      <section className="site-main">
        <header className="hp-section-head">
          <p className="hp-kicker">The fleet</p>
          <h1 className="hp-section-title">Three motor cars. Twelve-hour rates.</h1>
        </header>
        <div className="row">
          {fleet.map((car) => (
            <article key={car.id} className="fleet-card">
              <CarFigure
                label={`${car.name}${car.year ? ` ${car.year}` : ""}`}
                file={car.file}
              />
              <div className="fleet-meta">
                <h2 className="fleet-name">
                  {car.short}
                  {car.year ? <span> {car.year}</span> : null}
                </h2>
                <p className="fleet-price">
                  {formatNaira(car.rate12)}
                  <span> / 12 hours</span>
                </p>
                {car.note ? <p className="fleet-note">{car.note}</p> : null}
                <p className="fleet-inc">Chauffeur &amp; fuel included</p>
                <Link href={`/book?car=${car.id}`} className="hp-cta fleet-book">
                  Book this car
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
