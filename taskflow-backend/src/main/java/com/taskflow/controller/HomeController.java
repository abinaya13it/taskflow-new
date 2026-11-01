package com.taskflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "TaskFlow Backend is Running!";
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "TaskFlow Pro Java Full Stack Backend");
        health.put("framework", "Spring Boot 3.2.5");
        health.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(health);
    }
}
