package com.movierec.controller;

import com.movierec.model.DashboardStats;
import com.movierec.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public DashboardStats getDashboard() {
        return analyticsService.getDashboardData();
    }
}