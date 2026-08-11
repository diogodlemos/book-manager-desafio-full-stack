export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
}

export interface ErrorResponse {
    status: number;
    message: string;
    timestamp: string;
}

export interface AuthorRequest {
    name: string;
}

export interface AuthorResponse {
    id: number;
    name: string;
}

export interface BookRequest {
    title: string;
    year?: number | null;
    description?: string | null;
    authorIds: number[];
}

export interface BookResponse {
    id: number;
    title: string;
    year?: number | null;
    description?: string | null;
    authors: AuthorResponse[];
}

export interface PageResponse<T> {
    content: T[]
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    totalElements: number
    totalPages: number
}