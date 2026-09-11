import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import "./globals.css";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const steps = [
  { n: "01", title: "Select a motor car", body: "Seven motor cars, from Prado to Maybach. Twelve-hour rates published where listed." },
  { n: "02", title: "Confirm hours and area", body: "Twelve or twenty-four hours. Island, airport, or mainland." },
  { n: "03", title: "We dispatch to you", body: "Chauffeur and fuel included. The car arrives at your pickup address." },
];

export default function Home() {
  return (
    <main className="page homepage">
      <Nav />

      <section className="hp-hero" id="top">
        <div className="hp-hero-copy">
          <p className="hp-kicker">Lagos</p>
          <h1 className="hp-name">
            GW
            <span>Luxury</span>
          </h1>
          <p className="hp-deck">
            <span>
              Chauffeur-driven motor cars.{' '}
              <span className="hp-deck-break" />
              Fuel included.
            </span>
            <span>Dispatched to your address.</span>
          </p>
        </div>
        <figure className="hp-hero-still">
          <img
            src="/cars/g63-threequarter.png?v=10"
            alt="Mercedes-AMG G 63 2021"
            width={1920}
            height={1080}
          />
        </figure>
        <div className="hp-hero-cta">
          <Link href="/collection" className="hp-cta">
            The fleet
            <Arrow />
          </Link>
        </div>
      </section>

      <section className="hp-steps">
        <header className="hp-section-head">
          <p className="hp-kicker">Arrangement</p>
          <h2>How a booking proceeds.</h2>
        </header>
        <ol className="hp-steps-grid">
          {steps.map((s) => (
            <li key={s.n}>
              <span>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Footer />
    </main>
  );
}
