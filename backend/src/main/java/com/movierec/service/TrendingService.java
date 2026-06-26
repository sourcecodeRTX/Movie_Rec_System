package com.movierec.service;

import com.movierec.model.Movie;
import com.movierec.model.Review;
import com.movierec.repository.MovieRepository;
import com.movierec.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TrendingService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MovieRepository movieRepository;

    // Helper class to store temporary rating calculations
    public static class TrendingStats {
        public double totalRating = 0;
        public int reviewCount = 0;

        public double getTrendingScore() {
            if (reviewCount == 0) return 0;
            double averageRating = totalRating / reviewCount;
            // Logic: Average Rating + Review Count
            return averageRating + reviewCount; 
        }
    }

    public List<Movie> getTrendingMovies() {
        List<Review> allReviews = reviewRepository.findAll();
        Map<String, TrendingStats> statsMap = new HashMap<>();

        // Calculate total ratings and count for each movie
        for (Review review : allReviews) {
            statsMap.putIfAbsent(review.getMovieId(), new TrendingStats());
            TrendingStats stats = statsMap.get(review.getMovieId());
            stats.totalRating += review.getRating();
            stats.reviewCount += 1;
        }

        // Sort movies by their trending score (highest first)
        List<Map.Entry<String, TrendingStats>> sortedEntries = new ArrayList<>(statsMap.entrySet());
        sortedEntries.sort((a, b) -> Double.compare(b.getValue().getTrendingScore(), a.getValue().getTrendingScore()));

        List<Movie> trendingMovies = new ArrayList<>();
        int limit = 10; // Only get the Top 10 movies
        int count = 0;

        // Fetch movie details from database
        for (Map.Entry<String, TrendingStats> entry : sortedEntries) {
            if (count >= limit) break;
            Optional<Movie> movie = movieRepository.findById(entry.getKey());
            if (movie.isPresent()) {
                trendingMovies.add(movie.get());
                count++;
            }
        }

        return trendingMovies;
    }
}