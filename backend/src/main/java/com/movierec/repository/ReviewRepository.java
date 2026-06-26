package com.movierec.repository;

import com.movierec.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    // Find all reviews for a specific movie
    List<Review> findByMovieId(String movieId);
    
    // New: Find all reviews written by a specific user
    List<Review> findByUserId(String userId);
}