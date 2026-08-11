import apiClient from './client'
import type { AuthorRequest, AuthorResponse } from '../types'

export const authorsApi = {
    list: () =>
        apiClient.get<AuthorResponse[]>('/authors').then((r) => r.data),

    getById: (id: number) =>
        apiClient.get<AuthorResponse>(`/authors/${id}`).then((r) => r.data),

    create: (data: AuthorRequest) =>
        apiClient.post<AuthorResponse>('/authors', data).then((r) => r.data),

    update: (id: number, data: AuthorRequest) =>
        apiClient.put<AuthorResponse>(`/authors/${id}`, data).then((r) => r.data),

    delete: (id: number) =>
        apiClient.delete(`/authors/${id}`),
}
