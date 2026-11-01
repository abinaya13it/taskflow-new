package com.taskflow.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private UserDto user;
    private String token;

    public static class UserDto {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private java.time.LocalDateTime createdAt;

        public UserDto() {}

        public UserDto(Long id, String fullName, String email) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = "Pro Member";
        }

        public UserDto(Long id, String fullName, String email, String role, java.time.LocalDateTime createdAt) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public java.time.LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(java.time.LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    public AuthResponse() {}

    public AuthResponse(boolean success, String message, UserDto user, String token) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
