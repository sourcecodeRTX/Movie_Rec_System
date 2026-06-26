"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MovieCard, { Movie } from "@/components/MovieCard";
import { API_BASE_URL } from "@/config";

interface WatchlistItem {
  id: string | number;
  userId: string;
  movieId: string | number;
}

export default function WatchlistPage() {
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return;

    setLoading(true);
    try {
      // 1. Fetch watchlist items for user
      const watchResponse = await fetch(
        `${API_BASE_URL}/api/watchlist/user/${encodeURIComponent(userEmail)}`
      );
      if (!watchResponse.ok) {
        setWatchlistMovies([]);
        setLoading(false);
        return;
      }
      const watchlistItems: WatchlistItem[] = await watchResponse.json();

      if (watchlistItems.length === 0) {
        setWatchlistMovies([]);
        setLoading(false);
        return;
      }

      // 2. Fetch all movies to resolve details
      const moviesResponse = await fetch(`${API_BASE_URL}/api/movies`);
      if (!moviesResponse.ok) {
        setWatchlistMovies([]);
        setLoading(false);
        return;
      }
      const allMovies: Movie[] = await moviesResponse.json();

      // 3. Match saved movie IDs with real movie details
      const resolvedMovies: Movie[] = [];
      watchlistItems.forEach((item) => {
        const movie = allMovies.find((m) => String(m.id) === String(item.movieId));
        if (movie) {
          resolvedMovies.push(movie);
        }
      });

      setWatchlistMovies(resolvedMovies);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (movieId: string | number) => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/watchlist/user/${encodeURIComponent(
          userEmail
        )}/movie/${movieId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Movie removed successfully!");
        // Refresh local watchlist state
        fetchWatchlist();
      } else {
        alert("Failed to remove movie from watchlist.");
      }
    } catch (error) {
      console.error("Remove from watchlist error:", error);
      alert("Error contacting backend server.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Saved Movies</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Personal list of bookmarks. Click details to write reviews or write feedback.
          </p>
        </div>

        {/* Watchlist Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-[400px] animate-pulse">
                <div className="aspect-[2/3] w-full bg-neutral-800" />
                <div className="p-4 flex-grow space-y-3">
                  <div className="h-4 bg-neutral-800 w-3/4 rounded" />
                  <div className="h-3 bg-neutral-800 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : watchlistMovies.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-lg bg-neutral-900/30 max-w-md mx-auto mt-8">
            <svg
              className="mx-auto h-12 w-12 text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-neutral-300">Your Watchlist is empty</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Go back to the catalog and click &ldquo;Add to Watchlist&rdquo; on movies you want to save.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlistMovies.map((movie, index) => (
              <div key={`${movie.id}-${index}`}>
                <MovieCard
                  movie={movie}
                  showRemoveButton={true}
                  onRemove={handleRemoveFromWatchlist}
                />
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
