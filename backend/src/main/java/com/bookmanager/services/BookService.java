package com.bookmanager.services;

import com.bookmanager.dto.AuthorResponseDTO;
import com.bookmanager.dto.BookRequestDTO;
import com.bookmanager.dto.BookResponseDTO;
import com.bookmanager.entities.Author;
import com.bookmanager.entities.Book;
import com.bookmanager.entities.User;
import com.bookmanager.exceptions.ResourceNotFoundException;
import com.bookmanager.exceptions.UnauthorizedOperationException;
import com.bookmanager.repositories.AuthorRepository;
import com.bookmanager.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    @Transactional
    public BookResponseDTO create(BookRequestDTO dto, User currentUser) {
        Set<Author> authors = resolveAuthors(dto.authorIds());

        Book book = new Book();
        book.setTitle(dto.title());
        book.setYear(dto.year());
        book.setDescription(dto.description());
        book.setUser(currentUser);
        book.setAuthors(authors);

        return toResponse(bookRepository.save(book));
    }

    @Transactional(readOnly = true)
    public List<BookResponseDTO> listByUser(User currentUser) {
        return bookRepository.findByUserId(currentUser.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookResponseDTO getById(Long id, User currentUser) {
        Book book = findOrThrow(id);
        checkOwnership(book, currentUser);
        return toResponse(book);
    }

    @Transactional
    public BookResponseDTO update(Long id, BookRequestDTO dto, User currentUser) {
        Book book = findOrThrow(id);
        checkOwnership(book, currentUser);

        Set<Author> authors = resolveAuthors(dto.authorIds());

        book.setTitle(dto.title());
        book.setYear(dto.year());
        book.setDescription(dto.description());
        book.setAuthors(authors);

        return toResponse(bookRepository.save(book));
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Book book = findOrThrow(id);
        checkOwnership(book, currentUser);
        bookRepository.delete(book);
    }

    private Book findOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Livro não encontrado com id: " + id));
    }

    private void checkOwnership(Book book, User currentUser) {
        if (!book.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedOperationException(
                    "Você não tem permissão para acessar este livro");
        }
    }

    private Set<Author> resolveAuthors(Set<Long> authorIds) {
        if (authorIds == null || authorIds.isEmpty()) {
            return new HashSet<>();
        }
        Set<Author> authors = new HashSet<>(authorRepository.findAllById(authorIds));
        if (authors.size() != authorIds.size()) {
            throw new ResourceNotFoundException("Um ou mais autores não foram encontrados");
        }
        return authors;
    }

    private BookResponseDTO toResponse(Book book) {
        Set<AuthorResponseDTO> authorDTOs = book.getAuthors()
                .stream()
                .map(a -> new AuthorResponseDTO(a.getId(), a.getName()))
                .collect(Collectors.toSet());

        return new BookResponseDTO(
                book.getId(),
                book.getTitle(),
                book.getYear(),
                book.getDescription(),
                authorDTOs
        );
    }
}
