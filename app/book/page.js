import { Suspense } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";
import "./book.css";

export const metadata = {
  title: "GW Luxury · Book",
  description:
    "Book a GW Luxury chauffeur. Driver and fuel included. We come to your pickup address.",
};

export default function BookPage() {
  return (
    <main className="page site">
      <Nav />
      <section className="site-main book-wrap">
        <header className="hp-section-head">
          <p className="hp-kicker">Reservations</p>
          <h1 className="hp-section-title">Book a vehicle.</h1>
          <p className="hp-deck">
            Chauffeur and fuel included. Tell us the date, duration, area, and
            pickup address. Enterprise hire is available by the day.
          </p>
        </header>
        <Suspense fallback={<p className="hp-deck">Loading…</p>}>
          <BookingForm />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
