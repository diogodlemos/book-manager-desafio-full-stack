import type { AxiosError } from 'axios'
import type { ErrorResponse } from '../types'

export function extractApiError(err: unknown): string {
    const axiosErr = err as AxiosError<ErrorResponse>
    return (
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        'Ocorreu um erro inesperado. Tente novamente.'
    )
}
