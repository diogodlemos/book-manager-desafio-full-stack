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


    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login({ email, password })
            navigate('/books')
        } catch (err) {
            setError(extractApiError(err))
        } finally {
            setLoading(false)
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

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="
                    w-full rounded-xl border border-[#e5e4e7]
                    bg-white px-4 py-3
                    text-sm text-[#08060d]
                    outline-none
                    transition
                    hover:border-[#c9c5cf]
                    focus:ring-4 focus:ring-purple-100
                  "
                                />
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