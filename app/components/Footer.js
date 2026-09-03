export default function Footer() {
  return (
    <footer className="hp-foot">
      <p className="hp-foot-copy">
        © {new Date().getFullYear()} GW Luxury. A product of{" "}
        <span className="hp-orangered">ORANGERED</span> Ltd
      </p>
    </footer>
  );
}
