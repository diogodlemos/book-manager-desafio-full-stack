import apiClient from './client'
import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '../types'

export const authApi = {
    login: (data: LoginRequest) =>
        apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

    register: (data: RegisterRequest) =>
        apiClient.post<UserResponse>('/auth/register', data).then((r) => r.data),
}
