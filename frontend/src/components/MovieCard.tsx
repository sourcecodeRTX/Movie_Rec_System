import React from "react";
import Link from "next/link";

export interface Movie {
  id: string | number;
  title: string;
  genre: string;
  year: number;
  posterUrl: string;
  description: string;
}

interface MovieCardProps {
  movie: Movie;
  showRemoveButton?: boolean;
  onRemove?: (movieId: string | number) => void;
}

export default function MovieCard({ movie, showRemoveButton = false, onRemove }: MovieCardProps) {
  // Truncate helper
  const truncate = (str: string, n: number) => {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  };

  return (
    <div className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.6)] duration-300 transition-all">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.posterUrl || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop"}
          alt={movie.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 duration-300 transition-transform"
          onError={(e) => {
            // Fallback image if broken URL
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=300&auto=format&fit=crop";
          }}
        />
        {/* Genre Overlay on hover */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className="bg-black/70 backdrop-blur-sm text-[10px] text-neutral-300 font-semibold px-2 py-0.5 rounded">
            {movie.genre}
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-semibold text-base line-clamp-1 mb-1 group-hover:text-netflix-red duration-200 transition-colors">
          {movie.title}
        </h3>
        <p className="text-neutral-400 text-xs mb-2">
          {movie.year} &bull; {movie.genre}
        </p>
        <p className="text-neutral-500 text-xs line-clamp-3 mb-4 flex-grow">
          {movie.description}
        </p>

        {/* Action Button */}
        <div className="mt-auto space-y-2">
          <Link
            href={`/movie/${movie.id}`}
            className="block text-center w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs py-2 rounded transition-colors uppercase tracking-wider"
          >
            View Details
          </Link>
          
          {showRemoveButton && onRemove && (
            <button
              onClick={() => onRemove(movie.id)}
              className="w-full bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 hover:text-white font-medium text-xs py-2 rounded transition-colors uppercase tracking-wider"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
