package com.movierec.service;

import com.movierec.model.Watchlist;
import com.movierec.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    public Watchlist addToWatchlist(Watchlist watchlist) {
        return watchlistRepository.save(watchlist);
    }

    public List<Watchlist> getWatchlistByUser(String userId) {
        return watchlistRepository.findByUserId(userId);
    }

    public void removeFromWatchlist(String userId, String movieId) {
        watchlistRepository.deleteByUserIdAndMovieId(userId, movieId);
    }
}