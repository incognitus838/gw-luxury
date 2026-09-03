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
    id: "gwagon",
    file: "car1",
    name: "Mercedes-Benz G-Class",
    short: "G-Wagon",
    year: "2022",
    rate12: 1_000_000,
    note: null,
  },
  {
    id: "escalade",
    file: "car2",
    name: "Cadillac Escalade",
    short: "Escalade",
    year: null,
    rate12: 650_000,
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
];

export function formatNaira(n) {
  return `NGN ${n.toLocaleString("en-NG")}`;
}

export function getCar(id) {
  return fleet.find((c) => c.id === id) ?? fleet[0];
}
