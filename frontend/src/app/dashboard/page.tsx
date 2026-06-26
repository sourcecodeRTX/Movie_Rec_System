"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MovieCard, { Movie } from "@/components/MovieCard";

interface Analytics {
  totalUsers: number;
  totalMovies: number;
  totalReviews: number;
  topGenre: string;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalMovies: 0,
    totalReviews: 0,
    topGenre: "-",
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    // Authenticate user on mount
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) return; // Navbar will redirect automatically

    async function fetchAnalytics() {
      try {
        const response = await fetch("https://movie-rec-system-oanl.onrender.com/api/analytics/dashboard");
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoadingAnalytics(false);
      }
    }

    async function fetchMovies() {
      try {
        const response = await fetch("https://movie-rec-system-oanl.onrender.com/api/movies");
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
        }
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    }

    fetchAnalytics();
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {/* Section Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Platform Analytics
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time dashboard metrics from the Spring Boot API database.
          </p>
        </div>

        {/* Analytics Dashboard Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Card 1 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <h3 className="text-xs font-semibold text-netflix-red uppercase tracking-wider">
              Total Users
            </h3>
            {loadingAnalytics ? (
              <div className="h-9 bg-neutral-800 animate-pulse rounded mt-2 w-16" />
            ) : (
              <p className="text-3xl font-bold mt-2 text-white">{analytics.totalUsers}</p>
            )}
          </div>

          {/* Card 2 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Movies
            </h3>
            {loadingAnalytics ? (
              <div className="h-9 bg-neutral-800 animate-pulse rounded mt-2 w-16" />
            ) : (
              <p className="text-3xl font-bold mt-2 text-white">{analytics.totalMovies}</p>
            )}
          </div>

          {/* Card 3 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Reviews
            </h3>
            {loadingAnalytics ? (
              <div className="h-9 bg-neutral-800 animate-pulse rounded mt-2 w-16" />
            ) : (
              <p className="text-3xl font-bold mt-2 text-white">{analytics.totalReviews}</p>
            )}
          </div>

          {/* Card 4 */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Top Genre
            </h3>
            {loadingAnalytics ? (
              <div className="h-9 bg-neutral-800 animate-pulse rounded mt-2 w-24" />
            ) : (
              <p className="text-2xl font-bold mt-2 text-white truncate">{analytics.topGenre}</p>
            )}
          </div>
        </div>

        {/* Catalog Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Movie Catalog
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Browse movies and write reviews to get recommendations.
          </p>
        </div>

        {/* Movie Catalog Grid */}
        {loadingMovies ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-[400px] animate-pulse">
                <div className="aspect-[2/3] w-full bg-neutral-800" />
                <div className="p-4 flex-grow space-y-3">
                  <div className="h-4 bg-neutral-800 rounded w-3/4" />
                  <div className="h-3 bg-neutral-800 rounded w-1/2" />
                  <div className="h-3 bg-neutral-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-lg bg-neutral-900/30">
            <svg
              className="mx-auto h-12 w-12 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-neutral-300">No movies available</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Please add movies from the admin portal to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 border-t border-neutral-900 text-center text-xs text-neutral-500 bg-neutral-950">
        &copy; {new Date().getFullYear()} MovieRec Platform. All rights reserved.
      </footer>
    </div>
  );
}
