package com.dsasprint.dto;

public record AuthResponse(String token, UserProfile user) {
    public record UserProfile(Long id, String username, String role) {}
}
