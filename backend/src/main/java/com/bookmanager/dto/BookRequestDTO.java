package com.bookmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

@Schema(description = "Dados para criação ou atualização de um livro")
public record BookRequestDTO(

        @Schema(description = "Título do livro", example = "Dom Casmurro")
        @NotBlank(message = "Título é obrigatório")
        String title,

        @Schema(description = "Ano de publicação", example = "1899")
        Integer year,

        @Schema(description = "Descrição ou sinopse do livro", example = "Um clássico da literatura brasileira.")
        String description,

        @Schema(description = "IDs dos autores do livro", example = "[1]")
        @NotEmpty(message = "É necessário informar pelo menos um autor")
        Set<Long> authorIds

) {}
