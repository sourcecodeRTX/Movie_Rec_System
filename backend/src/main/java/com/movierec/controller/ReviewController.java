package com.movierec.controller;

import com.movierec.model.Review;
import com.movierec.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping("/movie/{movieId}")
    public List<Review> getMovieReviews(@PathVariable String movieId) {
        return reviewService.getReviewsByMovie(movieId);
    }
}