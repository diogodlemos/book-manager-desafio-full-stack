package com.bookmanager.dto;

import java.util.Set;

public record BookResponseDTO(
        Long id,

        String title,

        Integer year,

        String description,

        Set<AuthorResponseDTO> authors
) {
}
