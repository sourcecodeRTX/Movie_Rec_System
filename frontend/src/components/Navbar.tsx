"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Client-side authentication checks
    const loggedInUser = localStorage.getItem("loggedInUser");
    const adminStatus = localStorage.getItem("isAdmin");

    if (!loggedInUser) {
      router.push("/");
    } else {
      setUserEmail(loggedInUser);
    }

    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, [router, pathname]);

  const verifyPin = () => {
    const pin = prompt("Enter 6-digit Admin PIN:");
    if (pin) {
      try {
        if (btoa(pin) === "OTA1NjMz") {
          localStorage.setItem("isAdmin", "true");
          setIsAdmin(true);
          alert("Admin access granted!");
          // Trigger state update
          window.dispatchEvent(new Event("storage"));
          router.refresh();
        } else {
          alert("Security Alert: Incorrect PIN!");
        }
      } catch (err) {
        console.error("Encoding error:", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isAdmin");
    router.push("/");
  };

  const linkClass = (path: string) => {
    const base = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    return pathname === path
      ? `${base} text-white bg-neutral-900 border-b-2 border-netflix-red`
      : `${base} text-neutral-300 hover:text-white hover:bg-neutral-800`;
  };

  return (
    <nav className="bg-black/95 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <span className="text-netflix-red font-bold text-xl tracking-wider hover:opacity-90 transition-opacity">
                MovieRec
              </span>
            </Link>
            {/* Desktop Navigation Links */}
            <div className="hidden md:block ml-10 flex items-baseline space-x-4">
              <Link href="/dashboard" className={linkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/discover" className={linkClass("/discover")}>
                Discover
              </Link>
              <Link href="/watchlist" className={linkClass("/watchlist")}>
                My Watchlist
              </Link>
              {isAdmin && (
                <Link href="/add-movie" className={linkClass("/add-movie")}>
                  Add New Movie
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right Side (User status & Logout) */}
          <div className="hidden md:flex items-center space-x-4">
            {userEmail && (
              <span className="text-neutral-400 text-sm">
                Welcome, <span className="text-white font-medium">{userEmail}</span>
              </span>
            )}

            {!isAdmin && (
              <button
                onClick={verifyPin}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors uppercase tracking-wider"
              >
                Admin
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-netflix-red hover:bg-red-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors uppercase tracking-wider"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {!isAdmin && (
              <button
                onClick={verifyPin}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors uppercase tracking-wider"
              >
                Admin
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-800" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/dashboard" ? "bg-neutral-900 text-white" : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/discover"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/discover" ? "bg-neutral-900 text-white" : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              Discover
            </Link>
            <Link
              href="/watchlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/watchlist" ? "bg-neutral-900 text-white" : "text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              My Watchlist
            </Link>
            {isAdmin && (
              <Link
                href="/add-movie"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/add-movie" ? "bg-neutral-900 text-white" : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                }`}
              >
                Add New Movie
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-neutral-800">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-sm font-medium leading-none text-neutral-400">
                  Logged in as
                </div>
                <div className="text-base font-medium leading-none text-white mt-1">
                  {userEmail}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-netflix-red hover:bg-neutral-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
