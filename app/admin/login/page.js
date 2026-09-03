import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "../../lib/adminAuth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "GW Luxury · Inbox",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (verifyAdminToken(cookies().get(ADMIN_COOKIE)?.value)) {
    redirect("/admin");
  }
  return (
    <main className="page site admin-login">
      <p className="hp-kicker">House</p>
      <h1 className="hp-section-title">Inbox.</h1>
      <LoginForm />
    </main>
  );
}
