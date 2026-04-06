"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-cyber-primary text-glow-cyan font-mono mb-2">
            AZ-500
          </div>
          <div className="text-cyber-muted text-sm tracking-widest uppercase">
            Security Training Arena
          </div>
        </div>

        <div className="cyber-card p-8">
          <h1 className="text-xl font-semibold text-cyber-text mb-6">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-cyber-muted mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-cyber-text text-sm focus:outline-none focus:border-cyber-primary transition-colors"
                placeholder="Security Agent"
              />
            </div>

            <div>
              <label className="block text-sm text-cyber-muted mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-cyber-text text-sm focus:outline-none focus:border-cyber-primary transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-cyber-muted mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-cyber-text text-sm focus:outline-none focus:border-cyber-primary transition-colors"
                placeholder="Min. 6 characters"
              />
            </div>

            {error && (
              <div className="text-cyber-danger text-sm bg-cyber-danger/10 border border-cyber-danger/30 rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyber-primary text-cyber-bg font-semibold py-2 rounded hover:bg-cyber-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Join the Arena"}
            </button>
          </form>

          <p className="text-center text-cyber-muted text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-cyber-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
