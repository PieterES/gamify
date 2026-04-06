"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-cyber-primary text-glow-cyan font-mono mb-2">
            AZ-500
          </div>
          <div className="text-cyber-muted text-sm tracking-widest uppercase">
            Security Training Arena
          </div>
        </div>

        <div className="cyber-card p-8">
          <h1 className="text-xl font-semibold text-cyber-text mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-cyber-text text-sm focus:outline-none focus:border-cyber-primary transition-colors"
                placeholder="••••••••"
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
              {loading ? "Signing in..." : "Enter the Arena"}
            </button>
          </form>

          <p className="text-center text-cyber-muted text-sm mt-6">
            No account?{" "}
            <Link href="/register" className="text-cyber-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
