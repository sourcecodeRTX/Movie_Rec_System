"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MovieCard, { Movie } from "@/components/MovieCard";
import { API_BASE_URL } from "@/config";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return; // Navbar handles redirect

    async function loadTrending() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/trending`);
        if (response.ok) {
          const data = await response.json();
          setTrendingMovies(data);
        }
      } catch (error) {
        console.error("Trending fetch error:", error);
      } finally {
        setLoadingTrending(false);
      }
    }

    async function loadRecommendations(email: string) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/recommendations/user/${encodeURIComponent(email)}`
        );
        if (response.ok) {
          const data = await response.json();
          setRecommendedMovies(data);
        }
      } catch (error) {
        console.error("Recommendations fetch error:", error);
      } finally {
        setLoadingRecommendations(false);
      }
    }

    loadTrending();
    loadRecommendations(userEmail);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/movies/search?title=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 fade-in">
        {/* Search Section */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 shadow-md">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">Search Catalog</h2>
            <p className="text-neutral-400 text-sm">
              Instantly scan our database for specific movie titles.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a movie name..."
                className="flex-grow bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-netflix-red hover:bg-red-700 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
              >
                Search
              </button>
            </form>
          </div>

          {/* Search Results Display */}
          {hasSearched && (
            <div className="mt-8 pt-8 border-t border-neutral-800">
              <h3 className="text-lg font-semibold mb-6 text-neutral-200">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h3>
              {searching ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-neutral-950 border border-neutral-850 h-[380px] rounded-lg" />
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-neutral-500 text-center text-sm py-4">
                  No movies found. Try searching for something else.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {searchResults.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Trending Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
            <span className="text-netflix-red text-xl">🔥</span>
            <h2 className="text-xl font-bold tracking-tight">Trending Now</h2>
          </div>

          {loadingTrending ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-neutral-900 border border-neutral-800 h-[380px] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : trendingMovies.length === 0 ? (
            <p className="text-neutral-500 text-sm pl-2">
              Not enough reviews to determine trending movies. Review movies to generate trends!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Recommendations Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
            <span className="text-green-500 text-xl">✨</span>
            <h2 className="text-xl font-bold tracking-tight">Recommended For You</h2>
          </div>

          {loadingRecommendations ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-neutral-900 border border-neutral-800 h-[380px] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recommendedMovies.length === 0 ? (
            <p className="text-neutral-500 text-sm pl-2">
              Write some reviews in our catalog to activate personalized recommendations!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-12 py-6 border-t border-neutral-900 text-center text-xs text-neutral-500 bg-neutral-950">
        &copy; {new Date().getFullYear()} MovieRec Platform. All rights reserved.
      </footer>
    </div>
  );
}
