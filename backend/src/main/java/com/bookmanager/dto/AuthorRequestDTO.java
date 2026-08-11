package com.bookmanager.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Dados para criação ou atualização de um autor")
public record AuthorRequestDTO(

        @Schema(description = "Nome completo do autor", example = "Machado de Assis")
        @NotBlank(message = "O nome do autor é obrigatório")
        String name

) {}
