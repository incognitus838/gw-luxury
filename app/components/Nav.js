import Link from "next/link";

export default function Nav() {
  return (
    <header className="nav">
      <nav className="nav-left" aria-label="Primary">
        <Link href="/collection">Fleet</Link>
      </nav>
      <Link href="/" className="nav-mark" aria-label="GW Luxury home">
        GW
      </Link>
      <nav className="nav-right" aria-label="Secondary">
        <Link href="/book">Book</Link>
      </nav>
    </header>
  );
}
