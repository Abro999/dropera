"use client";

import { useEffect, useState } from "react";

type State = "checking" | "signed-out" | "signed-in";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setState(d.authenticated ? "signed-in" : "signed-out"))
      .catch(() => setState("signed-out"));
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't sign in.");
        return;
      }
      setPassword("");
      setState("signed-in");
    } catch {
      setError("Network error, try again.");
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setState("signed-out");
  };

  if (state === "checking") {
    return <div className="container-page py-14 text-sm font-sans text-charcoal/60">Loading…</div>;
  }

  if (state === "signed-out") {
    return (
      <div className="container-page py-14 max-w-sm">
        <h1 className="font-display text-3xl text-charcoal mb-6">Admin sign in</h1>
        <form onSubmit={signIn} className="flex flex-col gap-4">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line px-4 py-3 font-sans text-sm outline-none focus-visible:border-charcoal bg-cream"
            required
          />
          <button type="submit" disabled={busy} className="bg-ink text-cream font-sans py-3 rounded-full disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
          {error && <p className="text-rust text-sm font-sans">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-line bg-paper-soft">
        <div className="container-page py-2 flex justify-end">
          <button onClick={signOut} className="text-xs font-sans text-charcoal/60 underline">
            Sign out
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
