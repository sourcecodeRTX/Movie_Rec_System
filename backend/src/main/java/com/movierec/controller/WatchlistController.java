package com.movierec.controller;

import com.movierec.model.Watchlist;
import com.movierec.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping
    public Watchlist addToWatchlist(@RequestBody Watchlist watchlist) {
        return watchlistService.addToWatchlist(watchlist);
    }

    @GetMapping("/user/{userId}")
    public List<Watchlist> getUserWatchlist(@PathVariable String userId) {
        return watchlistService.getWatchlistByUser(userId);
    }

    @DeleteMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<String> removeFromWatchlist(@PathVariable String userId, @PathVariable String movieId) {
        watchlistService.removeFromWatchlist(userId, movieId);
        return ResponseEntity.ok("Removed from watchlist!");
    }
}