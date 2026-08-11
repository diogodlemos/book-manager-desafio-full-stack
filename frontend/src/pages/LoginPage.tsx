import {Link, useNavigate} from "react-router-dom";
import {type FormEvent, useState} from "react";
import {useAuth} from "../contexts/AuthContext.tsx";
import {extractApiError} from "../utils/error.ts";
import {Alert} from "../components/Alert.tsx";

export function LoginPage() {

    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)


    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)
        try {
            await login({ email, password })
            navigate('/books')
        } catch (err) {
            setError(extractApiError(err))
        } finally {
            setLoading(false)
            setSuccess(true)
        }
    }

    return (
        <main className="min-h-screen bg-[#faf9fc] px-4 py-8 sm:px-6 sm:py-10">
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <div className="w-full max-w-md">

                    <div className="mb-6 text-center sm:mb-8">
                        <div className="mx-auto mb-4 flex items-center justify-center rounded-2xl text-5xl sm:mb-5 sm:text-6xl">
                            📚
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-[#08060d] sm:text-3xl">
                            Book Manager
                        </h1>

                        <p className="mt-2 text-sm text-[#6b6375]">
                            Entre na sua conta
                        </p>
                    </div>

                    {error && <Alert message={error} />}


                    <div className="rounded-2xl border border-[#e5e4e7] bg-white p-5 shadow-[0_10px_40px_rgba(30,20,50,0.06)] sm:p-8">

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-[#08060d]"
                                >
                                    E-mail
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="voce@email.com"
                                    className="
                    w-full rounded-xl border
                    bg-white px-4 py-3
                    text-sm
                    outline-none
                    transition
                    placeholder:text-[#aaa4b0]
                    hover:border-[#c9c5cf]
                    focus:border-[#aa3bff]
                    focus:ring-4 focus:ring-purple-100
                  "
                                />
                            </div>

                            <div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <label
                                            htmlFor="password"
                                            className="text-sm font-medium text-[#08060d]"
                                        >
                                            Senha
                                        </label>

                                        <span className="text-xs text-[#8b8492]">
                                            Mín. 6 caracteres
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            disabled={loading || success}
                                            className="
                                                w-full rounded-xl border border-[#e5e4e7]
                                                bg-white px-4 py-3 pr-11
                                                text-sm text-[#08060d]
                                                outline-none
                                                transition
                                                placeholder:text-[#aaa4b0]
                                                hover:border-[#c9c5cf]
                                                focus:border-[#aa3bff]
                                                focus:ring-4 focus:ring-purple-100
                                                disabled:cursor-not-allowed
                                                disabled:bg-[#f7f6f8]
                                              "
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading || success}
                                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                            className="
                                                absolute
                                                right-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-[#8b8492]
                                                hover:text-[#aa3bff]
                                                transition-colors
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                              "
                                        >
                                            {showPassword ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.8}
                                                    stroke="currentColor"
                                                    className="h-5 w-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3.98 8.223A10.477 10.477 0 001.5 12s3.75 7.5 10.5 7.5c1.87 0 3.56-.44 5.02-1.177M6.228 6.228A10.45 10.45 0 0112 4.5c6.75 0 10.5 7.5 10.5 7.5a18.79 18.79 0 01-4.478 5.272M6.228 6.228L3 3m3.228 3.228l3.77 3.77m7.774 7.774L21 21m-3.228-3.228l-3.77-3.77m0 0a3 3 0 11-4.243-4.243"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.8}
                                                    stroke="currentColor"
                                                    className="h-5 w-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>



                            <button
                                type="submit"
                                disabled={loading}
                                className="
                  w-full rounded-xl
                  bg-[#aa3bff]
                  px-4 py-3
                  text-sm font-semibold text-white
                  shadow-md shadow-purple-200
                  transition-all
                  hover:bg-[#9628e8]
                  hover:shadow-lg hover:shadow-purple-200
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
                            >
                                {loading ? 'Acessando…' : 'Acessar'}
                            </button>
                        </form>

                        <div className="mt-6 border-t border-[#eeeef0] pt-6 text-center">
                            <p className="text-sm text-[#6b6375]">
                                Não tem uma conta?{' '}
                                <Link
                                    to="/register"
                                    className="font-semibold text-[#aa3bff] transition hover:text-[#8e24d6]"
                                >
                                    Criar conta
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 text-center text-xs text-[#9b95a2] sm:mt-6">
                        Book Manager
                    </p>
                </div>
            </div>
        </main>
    )
}