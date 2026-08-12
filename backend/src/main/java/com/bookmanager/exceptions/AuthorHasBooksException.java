package com.bookmanager.exceptions;

public class AuthorHasBooksException extends RuntimeException {
    public AuthorHasBooksException(String message) {
        super(message);
    }
}
