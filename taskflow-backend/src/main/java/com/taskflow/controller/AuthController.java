package com.taskflow.controller;

import com.taskflow.dto.AuthResponse;
import com.taskflow.dto.LoginRequest;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Supports both /register and /api/auth/register
    @PostMapping({"/register", "/api/auth/register"})
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Supports both /login and /api/auth/login
    @PostMapping({"/login", "/api/auth/login"})
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // Supports fetching user profile details
    @GetMapping({"/api/auth/profile/{id}", "/api/user/profile/{id}"})
    public ResponseEntity<AuthResponse.UserDto> getProfile(@PathVariable Long id) {
        AuthResponse.UserDto user = authService.getUserProfile(id);
        return ResponseEntity.ok(user);
    }

    // Supports updating user profile details
    @PutMapping({"/api/auth/profile/{id}", "/api/user/profile/{id}"})
    public ResponseEntity<AuthResponse.UserDto> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody com.taskflow.dto.UpdateProfileRequest request) {
        AuthResponse.UserDto updated = authService.updateUserProfile(id, request);
        return ResponseEntity.ok(updated);
    }
}
