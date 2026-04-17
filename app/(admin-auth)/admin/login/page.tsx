"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Anmeldung fehlgeschlagen.");
      }
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">
        <h1 className="font-serif text-2xl text-warm-800 mb-6 text-center">
          Admin-Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-warm-700 mb-1"
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 border border-warm-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Admin-Passwort eingeben"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-warm-800 text-white py-2 px-4 rounded-md hover:bg-warm-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Anmelden..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
