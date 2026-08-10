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