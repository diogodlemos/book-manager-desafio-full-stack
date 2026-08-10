import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import type { LoginRequest, RegisterRequest, UserResponse } from '../types'

interface AuthContextValue {
    user: UserResponse | null
    token: string | null
    isAuthenticated: boolean
    login: (data: LoginRequest) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): UserResponse | null {
    try {
        const raw = localStorage.getItem('user')
        return raw ? (JSON.parse(raw) as UserResponse) : null
    } catch {
        return null
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(loadUser)
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'))

    const login = useCallback(async (data: LoginRequest) => {
        console.log('LOGIN - enviando:', data)

        const response = await authApi.login(data)

        console.log('LOGIN - resposta:', response)

        const { accessToken } = response

        console.log('LOGIN - accessToken:', accessToken)

        localStorage.setItem('accessToken', accessToken)
        setToken(accessToken)

        const payload = JSON.parse(
            atob(accessToken.split('.')[1])
        ) as {
            sub: string
            id: number
        }

        console.log('LOGIN - payload:', payload)

        const partial: UserResponse = {
            id: payload.id,
            name: '',
            email: payload.sub,
        }

        localStorage.setItem('user', JSON.stringify(partial))
        setUser(partial)
    }, [])

    const register = useCallback(async (data: RegisterRequest) => {
        await authApi.register(data)
    }, [login])

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
    return ctx
}
