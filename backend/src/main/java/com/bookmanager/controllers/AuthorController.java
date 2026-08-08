package com.bookmanager.controllers;

import com.bookmanager.dto.AuthorRequestDTO;
import com.bookmanager.dto.AuthorResponseDTO;
import com.bookmanager.dto.ErrorResponseDTO;
import com.bookmanager.services.AuthorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/authors")
@AllArgsConstructor
@Tag(name = "Autores", description = "Gerenciamento de autores")
@SecurityRequirement(name = "bearerAuth")
public class AuthorController {

    private final AuthorService authorService;

    @Operation(summary = "Criar novo autor")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Autor criado com sucesso",
                    content = @Content(schema = @Schema(implementation = AuthorResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true)))
    })
    @PostMapping
    public ResponseEntity<AuthorResponseDTO> create(
            @Valid @RequestBody AuthorRequestDTO dto
    ) {
        AuthorResponseDTO response = authorService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Listar todos os autores")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AuthorResponseDTO.class)))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true)))
    })
    @GetMapping
    public ResponseEntity<List<AuthorResponseDTO>> listAll() {
        return ResponseEntity.ok(authorService.listAll());
    }

    @Operation(summary = "Buscar autor por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Autor encontrado",
                    content = @Content(schema = @Schema(implementation = AuthorResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "404", description = "Autor não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponseDTO> getById(
            @Parameter(description = "ID do autor") @PathVariable Long id
    ) {
        return ResponseEntity.ok(authorService.getById(id));
    }

    @Operation(summary = "Atualizar autor")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Autor atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = AuthorResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "404", description = "Autor não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<AuthorResponseDTO> update(
            @Parameter(description = "ID do autor") @PathVariable Long id,
            @Valid @RequestBody AuthorRequestDTO dto
    ) {
        return ResponseEntity.ok(authorService.update(id, dto));
    }

    @Operation(summary = "Excluir autor")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Autor excluído com sucesso",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "404", description = "Autor não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do autor") @PathVariable Long id
    ) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
