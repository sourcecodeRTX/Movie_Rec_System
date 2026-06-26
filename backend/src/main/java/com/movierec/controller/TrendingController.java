package com.movierec.controller;

import com.movierec.model.Movie;
import com.movierec.service.TrendingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trending")
@CrossOrigin(origins = "*")
public class TrendingController {

    @Autowired
    private TrendingService trendingService;

    @GetMapping
    public List<Movie> getTrending() {
        return trendingService.getTrendingMovies();
    }
}