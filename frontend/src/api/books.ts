import apiClient from './client'
import type { BookRequest, BookResponse, PageResponse } from '../types'

export const booksApi = {
    list: (page = 0, size = 9, title = '') =>
        apiClient
            .get<PageResponse<BookResponse>>('/books', {
                params: {
                    page,
                    size,
                    ...(title.trim() && { title: title.trim() }),
                },
            })
            .then((r) => r.data),

    getById: (id: number) =>
        apiClient.get<BookResponse>(`/books/${id}`).then((r) => r.data),

    create: (data: BookRequest) =>
        apiClient.post<BookResponse>('/books/create', data).then((r) => r.data),

    update: (id: number, data: BookRequest) =>
        apiClient.put<BookResponse>(`/books/${id}`, data).then((r) => r.data),

    delete: (id: number) =>
        apiClient.delete(`/books/${id}`),
}