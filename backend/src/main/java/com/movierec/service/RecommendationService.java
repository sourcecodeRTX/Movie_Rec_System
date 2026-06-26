package com.movierec.service;

import com.movierec.model.Movie;
import com.movierec.model.Review;
import com.movierec.repository.MovieRepository;
import com.movierec.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RecommendationService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getRecommendations(String userId) {
        // Step 1: Get all reviews written by this user
        List<Review> userReviews = reviewRepository.findByUserId(userId);

        if (userReviews.isEmpty()) {
            // Return an empty list if the user has no reviews yet
            return new ArrayList<>();
        }

        Set<String> favoriteGenres = new HashSet<>();
        List<String> reviewedMovieIds = new ArrayList<>();

        // Step 2: Find the genres of the movies the user has reviewed
        for (Review review : userReviews) {
            reviewedMovieIds.add(review.getMovieId());
            movieRepository.findById(review.getMovieId()).ifPresent(movie -> {
                favoriteGenres.add(movie.getGenre());
            });
        }

        List<Movie> recommendations = new ArrayList<>();

        // Step 3: Find other movies in these favorite genres
        for (String genre : favoriteGenres) {
            List<Movie> moviesInGenre = movieRepository.findByGenreIgnoreCase(genre);
            
            for (Movie movie : moviesInGenre) {
                // Step 4: Do not recommend movies the user has already reviewed
                if (!reviewedMovieIds.contains(movie.getId()) && !recommendations.contains(movie)) {
                    recommendations.add(movie);
                }
            }
        }

        return recommendations;
    }
}