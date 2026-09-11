export const BOOKING_EMAIL = "bookings@gwluxury.com";

export const AREAS = [
  { value: "island", label: "Lagos Island" },
  { value: "airport", label: "Airport" },
  { value: "lekki", label: "Lekki" },
  { value: "mainland", label: "Mainland" },
  { value: "other", label: "Other" },
];

export const fleet = [
  {
    id: "gle53",
    file: "gle53",
    name: "Mercedes-AMG GLE 53",
    short: "GLE 53",
    year: "2021",
    rate12: null,
    note: null,
  },
  {
    id: "gwagon",
    file: "g63",
    name: "Mercedes-AMG G 63",
    short: "G-Wagon G63",
    year: "2021",
    rate12: 1_000_000,
    note: null,
  },
  {
    id: "prado",
    file: "car3",
    name: "Toyota Land Cruiser Prado",
    short: "Prado",
    year: "2020",
    rate12: 150_000,
    note: "Island & Airport",
  },
  {
    id: "viano",
    file: "viano",
    name: "Mercedes-Benz Maybach Viano",
    short: "Maybach Viano",
    year: null,
    rate12: null,
    note: "VIP bus",
  },
  {
    id: "escalade",
    file: "car2",
    name: "Cadillac Escalade",
    short: "Escalade",
    year: "2022",
    rate12: 650_000,
    note: null,
  },
  {
    id: "lx600",
    file: "lx600",
    name: "Lexus LX 600",
    short: "LX 600",
    year: "2024",
    rate12: null,
    note: null,
  },
  {
    id: "maybach",
    file: "maybach",
    name: "Mercedes-Maybach S-Class",
    short: "Maybach",
    year: "2021",
    rate12: null,
    note: null,
  },
];

export function formatNaira(n) {
  if (n == null) return "Quoted";
  return `NGN ${n.toLocaleString("en-NG")}`;
}

export function getCar(id) {
  return fleet.find((c) => c.id === id) ?? fleet[0];
}
