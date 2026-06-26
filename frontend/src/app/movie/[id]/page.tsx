"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Movie } from "@/components/MovieCard";
import { API_BASE_URL } from "@/config";

interface Review {
  id: string | number;
  movieId: string | number;
  userId: string;
  rating: number;
  reviewText: string;
}

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const movieId = unwrappedParams.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review Form state
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Watchlist status
  const [addingWatchlist, setAddingWatchlist] = useState(false);

  const loadMovie = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies`);
      if (response.ok) {
        const movies: Movie[] = await response.json();
        const found = movies.find((m) => String(m.id) === String(movieId));
        if (found) {
          setMovie(found);
        } else {
          setMovie(null);
        }
      }
    } catch (error) {
      console.error("Error fetching movie info:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/movie/${movieId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadMovie();
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const handleWatchlistAdd = async () => {
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail) return;

    setAddingWatchlist(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userEmail, movieId: movieId }),
      });

      if (response.ok) {
        alert("Added to Watchlist successfully!");
      } else {
        alert("Failed to add movie to watchlist.");
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("Error contacting the watchlist server.");
    } finally {
      setAddingWatchlist(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("loggedInUser");
    if (!userEmail || !reviewText.trim()) return;

    setSubmittingReview(true);
    const reviewData = {
      movieId: movieId,
      userId: userEmail,
      rating: parseInt(rating),
      reviewText: reviewText,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        alert("Review added successfully!");
        setReviewText("");
        setRating("5");
        loadReviews(); // Refresh review feeds
      } else {
        alert("Failed to post your review. Check input fields.");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Error posting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-netflix-red border-t-transparent animate-spin rounded-full" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold text-red-500">Movie Not Found</h1>
          <p className="text-neutral-400 mt-2">The selected movie index could not be resolved from our database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Movie Detail Card & Write Review Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Info Block */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-lg">
              {/* Poster Image */}
              <div className="md:w-1/3 aspect-[2/3] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movie.posterUrl || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop"}
                  alt={movie.title}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Text Info */}
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">{movie.title}</h1>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-neutral-800 text-neutral-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {movie.genre}
                    </span>
                    <span className="bg-netflix-red/10 border border-netflix-red/25 text-netflix-red text-xs font-semibold px-3 py-1 rounded-full">
                      {movie.year}
                    </span>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                    {movie.description}
                  </p>
                </div>

                <button
                  onClick={handleWatchlistAdd}
                  disabled={addingWatchlist}
                  className="w-full md:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs px-6 py-3 rounded-lg transition-colors uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-900 border border-neutral-700"
                >
                  <span>{addingWatchlist ? "Saving..." : "➕ Add to My Watchlist"}</span>
                </button>
              </div>
            </div>

            {/* Write a Review Block */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm"
                  >
                    <option value="5">⭐️⭐️⭐️⭐️⭐️ (5 Stars)</option>
                    <option value="4">⭐️⭐️⭐️⭐️ (4 Stars)</option>
                    <option value="3">⭐️⭐️⭐️ (3 Stars)</option>
                    <option value="2">⭐️⭐️ (2 Stars)</option>
                    <option value="1">⭐️ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-all text-sm resize-none"
                    placeholder="Provide your thoughts on the cinematography, acting, storyline..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-netflix-red hover:bg-red-700 disabled:bg-neutral-800 text-white font-semibold text-xs px-6 py-3 rounded transition-colors uppercase tracking-wider cursor-pointer"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: User Reviews Feed List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-neutral-900 pb-2">User Reviews</h3>

            {loadingReviews ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-neutral-900 border border-neutral-800 h-28 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-neutral-500 text-sm">
                No reviews yet. Be the first to share your opinion!
              </p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-netflix-red font-medium truncate max-w-[150px]">
                        {r.userId}
                      </span>
                      <span className="text-warning text-xs font-semibold whitespace-nowrap">
                        ⭐️ {r.rating}/5
                      </span>
                    </div>
                    <p className="text-neutral-300 text-xs leading-relaxed">{r.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-neutral-900 text-center text-xs text-neutral-500 bg-neutral-950">
        &copy; {new Date().getFullYear()} MovieRec Platform. All rights reserved.
      </footer>
    </div>
  );
}
