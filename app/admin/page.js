import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "../lib/adminAuth";
import { loadBookings } from "../lib/bookings";
import Inbox from "./Inbox";

export const metadata = {
  title: "GW Luxury · Inbox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }
  const bookings = await loadBookings();
  return <Inbox initial={bookings} />;
}
