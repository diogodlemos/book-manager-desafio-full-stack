package com.bookmanager.dto;

public record UserResponseDTO(
        Long id,
        String name,
        String email
) {
}