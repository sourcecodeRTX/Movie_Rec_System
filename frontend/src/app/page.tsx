"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (localStorage.getItem("loggedInUser")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      const result = await response.text();

      if (response.ok) {
        alert(result); // Shows "Login successful! Welcome [Name]"
        localStorage.setItem("loggedInUser", email);
        router.push("/dashboard");
      } else {
        setErrorMsg(result || "Login failed. Check your password.");
      }
    } catch (err) {
      setErrorMsg("Error connecting to the backend. Please check your network.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white select-none">
      {/* Header Bar */}
      <header className="p-6 border-b border-neutral-900 bg-black/50 sticky top-0 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-netflix-red font-bold text-2xl tracking-wider select-none">
            MovieRec
          </span>
        </div>
      </header>

      {/* Main Login Form Content */}
      <main className="flex-grow flex items-center justify-center p-4 fade-in">
        <div className="bg-black/80 border border-neutral-800 rounded-lg p-8 w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-semibold mb-6">Sign In</h1>

          {errorMsg && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 px-4 py-3 rounded text-sm mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-netflix-red hover:bg-red-700 disabled:bg-neutral-800 text-white font-semibold py-3 px-4 rounded transition-colors text-sm uppercase tracking-widest mt-2 cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            <span>New to MovieRec? </span>
            <Link
              href="/register"
              className="text-white hover:underline font-medium transition-all"
            >
              Register here
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-neutral-900 text-center text-xs text-neutral-500 bg-neutral-950">
        &copy; {new Date().getFullYear()} MovieRec Platform. All rights reserved.
      </footer>
    </div>
  );
}
