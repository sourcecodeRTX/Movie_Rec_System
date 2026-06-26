package com.movierec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MovieRecApplication {
    public static void main(String[] args) {
        SpringApplication.run(MovieRecApplication.class, args);
        System.out.println("Backend is running securely on port 8080!");
    }
}