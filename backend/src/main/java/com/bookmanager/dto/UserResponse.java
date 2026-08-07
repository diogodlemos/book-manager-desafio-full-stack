package com.bookmanager.dto;

public record UserResponse(
        Long id,
        String name,
        String email
) {
}