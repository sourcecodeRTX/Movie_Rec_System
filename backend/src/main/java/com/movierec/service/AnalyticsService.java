package com.movierec.service;

import com.movierec.model.DashboardStats;
import com.movierec.model.Movie;
import com.movierec.repository.MovieRepository;
import com.movierec.repository.ReviewRepository;
import com.movierec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TrendingService trendingService; // Reusing the code from Module 7

    public DashboardStats getDashboardData() {
        DashboardStats stats = new DashboardStats();

        // 1. Get simple counts from the database
        stats.setTotalUsers(userRepository.count());
        stats.setTotalMovies(movieRepository.count());
        stats.setTotalReviews(reviewRepository.count());

        // 2. Calculate the top genre
        List<Movie> allMovies = movieRepository.findAll();
        Map<String, Integer> genreCount = new HashMap<>();
        String topGenre = "N/A";
        int maxCount = 0;

        for (Movie movie : allMovies) {
            String genre = movie.getGenre();
            if (genre != null && !genre.isEmpty()) {
                int count = genreCount.getOrDefault(genre, 0) + 1;
                genreCount.put(genre, count);
                
                // Keep track of the highest count
                if (count > maxCount) {
                    maxCount = count;
                    topGenre = genre;
                }
            }
        }
        stats.setTopGenre(topGenre);

        // 3. Get trending movies from our Module 7 logic
        stats.setTrendingMovies(trendingService.getTrendingMovies());

        return stats;
    }
}