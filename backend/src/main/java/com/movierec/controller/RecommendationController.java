package com.movierec.controller;

import com.movierec.model.Movie;
import com.movierec.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public List<Movie> getUserRecommendations(@PathVariable String userId) {
        return recommendationService.getRecommendations(userId);
    }
}