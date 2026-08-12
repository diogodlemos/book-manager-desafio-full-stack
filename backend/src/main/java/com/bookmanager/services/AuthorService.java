package com.bookmanager.services;

import com.bookmanager.dto.AuthorRequestDTO;
import com.bookmanager.dto.AuthorResponseDTO;
import com.bookmanager.entities.Author;
import com.bookmanager.exceptions.AuthorHasBooksException;
import com.bookmanager.exceptions.ResourceNotFoundException;
import com.bookmanager.repositories.AuthorRepository;
import com.bookmanager.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    public AuthorResponseDTO create(AuthorRequestDTO dto) {
        Author author = new Author();
        author.setName(dto.name());
        Author saved = authorRepository.save(author);
        return toResponse(saved);
    }

    public List<AuthorResponseDTO> listAll() {
        return authorRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AuthorResponseDTO getById(Long id) {
        Author author = findOrThrow(id);
        return toResponse(author);
    }

    public AuthorResponseDTO update(Long id, AuthorRequestDTO dto) {
        Author author = findOrThrow(id);
        author.setName(dto.name());
        Author saved = authorRepository.save(author);
        return toResponse(saved);
    }

    public void delete(Long id) {
        Author author = findOrThrow(id);

        long bookCount = bookRepository.countByAuthorId(id);
        if (bookCount > 0) {
            throw new AuthorHasBooksException(
                    "Não é possível excluir o autor \"" + author.getName() +
                    "\" pois ele possui " + bookCount +
                    " livro(s) cadastrado(s). Remova os livros associados antes de excluir o autor.");
        }

        authorRepository.delete(author);
    }

    private Author findOrThrow(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Autor não encontrado com id: " + id));
    }

    private AuthorResponseDTO toResponse(Author author) {
        return new AuthorResponseDTO(author.getId(), author.getName());
    }
}
