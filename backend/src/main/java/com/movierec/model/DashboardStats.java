package com.movierec.model;

import java.util.List;

public class DashboardStats {
    private long totalUsers;
    private long totalMovies;
    private long totalReviews;
    private String topGenre;
    private List<Movie> trendingMovies;

    public DashboardStats() {}

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalMovies() { return totalMovies; }
    public void setTotalMovies(long totalMovies) { this.totalMovies = totalMovies; }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }

    public String getTopGenre() { return topGenre; }
    public void setTopGenre(String topGenre) { this.topGenre = topGenre; }

    public List<Movie> getTrendingMovies() { return trendingMovies; }
    public void setTrendingMovies(List<Movie> trendingMovies) { this.trendingMovies = trendingMovies; }
}