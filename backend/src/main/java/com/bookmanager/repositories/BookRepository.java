package com.bookmanager.repositories;

import com.bookmanager.entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByUserId(Long userId);

    Page<Book> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title, Pageable pageable);

    Page<Book> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT COUNT(b) FROM Book b JOIN b.authors a WHERE a.id = :authorId")
    long countByAuthorId(@Param("authorId") Long authorId);
}
