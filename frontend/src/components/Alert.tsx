interface AlertProps {
    message: string
    type?: 'error' | 'success' | 'info'
}

export function Alert({ message, type = 'error' }: AlertProps) {
    const styles = {
        error: 'bg-red-50 border-red-300 text-red-600',
        success: 'bg-green-50 border-green-300 text-green-600',
        info: 'bg-cyan-50 border-cyan-300 text-cyan-600',
    }

    return (
        <div
            role="alert"
            className={`mb-4 rounded-lg border px-4 py-2.5 text-sm ${styles[type]}`}
        >
            {message}
        </div>
    )
}