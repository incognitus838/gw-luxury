"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) {
        setError(payload.error || "Could not sign in.");
        setSaving(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not sign in.");
      setSaving(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={onSubmit}>
      <label className="book-field">
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      {error ? (
        <p className="book-err" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="book-submit" disabled={saving}>
        {saving ? "Signing in…" : "Open inbox"}
      </button>
    </form>
  );
}
