package com.bookmanager.controllers;

import com.bookmanager.dto.BookRequestDTO;
import com.bookmanager.dto.BookResponseDTO;
import com.bookmanager.dto.ErrorResponseDTO;
import com.bookmanager.entities.User;
import com.bookmanager.services.BookService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@AllArgsConstructor
@Tag(name = "Livros", description = "Gerenciamento de livros. Cada usuário só pode editar e visualizar seus próprios livros.")
@SecurityRequirement(name = "bearerAuth")
public class BookController {

    private final BookService bookService;

    @Operation(summary = "Criar novo livro",
            description = "O livro é associado automaticamente ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Livro criado com sucesso",
                    content = @Content(schema = @Schema(implementation = BookResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "404", description = "Um ou mais autores não encontrados",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping("/create")
    public ResponseEntity<BookResponseDTO> create(
            @Valid @RequestBody BookRequestDTO dto,
            @Parameter(hidden = true) @AuthenticationPrincipal User currentUser
    ) {
        BookResponseDTO response = bookService.create(dto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Listar meus livros",
            description = "Retorna apenas os livros pertencentes ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = BookResponseDTO.class)))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true)))
    })
    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> listMyBooks(
            @Parameter(hidden = true) @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(bookService.listByUser(currentUser));
    }

    @Operation(summary = "Buscar livro por ID",
            description = "Retorna o livro somente se pertencer ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro encontrado",
                    content = @Content(schema = @Schema(implementation = BookResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "403", description = "Livro pertence a outro usuário",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getById(
            @Parameter(description = "ID do livro") @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(bookService.getById(id, currentUser));
    }

    @Operation(summary = "Atualizar livro",
            description = "Somente o dono do livro pode atualizá-lo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = BookResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "403", description = "Livro pertence a outro usuário",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Livro ou autor não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> update(
            @Parameter(description = "ID do livro") @PathVariable Long id,
            @Valid @RequestBody BookRequestDTO dto,
            @Parameter(hidden = true) @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(bookService.update(id, dto, currentUser));
    }

    @Operation(summary = "Excluir livro",
            description = "Somente o dono do livro pode excluí-lo.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Livro excluído com sucesso",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "401", description = "Não autenticado",
                    content = @Content(schema = @Schema(hidden = true))),
            @ApiResponse(responseCode = "403", description = "Livro pertence a outro usuário",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do livro") @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal User currentUser
    ) {
        bookService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
