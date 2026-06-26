"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AddMoviePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check admin authorization status
    const loggedInUser = localStorage.getItem("loggedInUser");
    const isAdmin = localStorage.getItem("isAdmin");

    if (!loggedInUser) {
      router.push("/");
    } else if (isAdmin !== "true") {
      alert("Access Denied: Admin privileges required.");
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !genre || !year || !posterUrl || !description) return;

    setLoading(true);
    setErrorMsg(null);

    const movieData = {
      title,
      genre,
      year: parseInt(year),
      posterUrl,
      description,
    };

    try {
      const response = await fetch("https://movie-rec-system-oanl.onrender.com/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      if (response.ok) {
        alert("Movie added successfully!");
        router.push("/dashboard");
      } else {
        setErrorMsg("Failed to add movie. Please check the details you entered.");
      }
    } catch (err) {
      setErrorMsg("Error connecting to the database server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 py-12 fade-in">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 w-full max-w-2xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Add New Movie</h1>
            <p className="text-sm text-neutral-400 mt-2">
              Populate metadata to index this entry into the global recommendation feed.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 px-4 py-3 rounded text-sm mb-6">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Movie Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                placeholder="e.g. Interstellar"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                  placeholder="e.g. Sci-Fi, Thriller"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Release Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  min="1880"
                  max={new Date().getFullYear() + 5}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                  placeholder="e.g. 2014"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Poster Image URL
              </label>
              <input
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                placeholder="e.g. https://domain.com/poster.jpg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Short Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm resize-none"
                placeholder="Write a brief overview of the plot, cast, and director..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-1/2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-4 rounded transition-colors text-sm uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-netflix-red hover:bg-red-700 disabled:bg-neutral-800 text-white font-semibold py-3 px-4 rounded transition-colors text-sm uppercase tracking-wider cursor-pointer"
              >
                {loading ? "Saving Movie..." : "Save Movie"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 border-t border-neutral-900 text-center text-xs text-neutral-500 bg-neutral-950">
        &copy; {new Date().getFullYear()} MovieRec Platform. All rights reserved.
      </footer>
    </div>
  );
}
