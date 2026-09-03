import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hp-foot">
      <div className="hp-foot-brand">
        <strong>GW Luxury</strong>
        <p>Chauffeur-driven motor cars. Lagos.</p>
      </div>
      <nav aria-label="Footer">
        <Link href="/collection">Fleet</Link>
        <Link href="/book">Book</Link>
      </nav>
      <p className="hp-foot-copy">© {new Date().getFullYear()} GW Luxury</p>
    </footer>
  );
}
