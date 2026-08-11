import { Alert } from '../components/Alert.tsx'
import { type FormEvent, useEffect, useState } from 'react'
import { Loading } from '../components/Loading.tsx'
import type { AuthorResponse } from '../types'
import { Modal } from '../components/Modal.tsx'
import { authorsApi } from '../api/authors.ts'
import { extractApiError } from '../utils/error.ts'

export function AuthorsPage() {
    const [authors, setAuthors] = useState<AuthorResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editAuthor, setEditAuthor] =
        useState<AuthorResponse | null>(null)
    const [formName, setFormName] = useState('')
    const [formError, setFormError] = useState('')
    const [formSaving, setFormSaving] = useState(false)
    const [deleteTarget, setDeleteTarget] =
        useState<AuthorResponse | null>(null)
    const [deleteError, setDeleteError] = useState('')

    async function fetchAuthors() {
        try {
            setError('')

            const data = await authorsApi.list()

            setAuthors(
                [...data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
            )
        } catch (err) {
            setError(extractApiError(err))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchAuthors()
    }, [])

    function openCreate() {
        setEditAuthor(null)
        setFormName('')
        setFormError('')
        setShowForm(true)
    }

    function openEdit(author: AuthorResponse) {
        setEditAuthor(author)
        setFormName(author.name)
        setFormError('')
        setShowForm(true)
    }

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault()

        const trimmed = formName.trim()

        if (!trimmed) {
            setFormError('O nome é obrigatório.')
            return
        }

        setFormError('')
        setFormSaving(true)

        try {
            if (editAuthor) {
                const updated = await authorsApi.update(
                    editAuthor.id,
                    { name: trimmed }
                )

                setAuthors((prev) =>
                    [...prev.map((author) =>
                        author.id === updated.id
                            ? updated
                            : author
                    )].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )
                )
            } else {
                const created = await authorsApi.create({
                    name: trimmed,
                })

                setAuthors((prev) =>
                    [...prev, created].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )
                )
            }

            setShowForm(false)
        } catch (err) {
            setFormError(extractApiError(err))
        } finally {
            setFormSaving(false)
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return

        try {
            await authorsApi.delete(deleteTarget.id)

            setAuthors((prev) =>
                prev.filter(
                    (author) => author.id !== deleteTarget.id
                )
            )

            setDeleteTarget(null)
        } catch (err) {
            setDeleteError(extractApiError(err))
        }
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div
                className="
                    mb-6
                    flex flex-col gap-4
                    sm:mb-8
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h1
                        className="
                            text-2xl font-bold
                            tracking-tight
                            text-[#08060d]
                            sm:text-3xl
                        "
                    >
                        Autores
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[#6b6375]
                        "
                    >
                        Gerencie os autores da sua biblioteca.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreate}
                    className="
                        w-full rounded-xl
                        bg-[#aa3bff]
                        px-5 py-3
                        text-sm font-semibold
                        text-white
                        shadow-md
                        shadow-purple-200
                        transition-all
                        hover:bg-[#9628e8]
                        hover:shadow-lg
                        hover:shadow-purple-200
                        active:scale-[0.99]
                        sm:w-auto
                    "
                >
                    + Novo Autor
                </button>
            </div>

            {/* Erro */}
            {error && (
                <div className="mb-6">
                    <Alert message={error} />
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div
                    className="
                        flex
                        min-h-[300px]
                        items-center
                        justify-center
                    "
                >
                    <Loading />
                </div>
            ) : authors.length === 0 ? (

                /* Estado vazio */
                <div
                    className="
                        flex flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-dashed
                        border-[#d9d5dd]
                        bg-white
                        px-5 py-12
                        text-center
                        shadow-[0_8px_30px_rgba(30,20,50,0.03)]
                        sm:px-8
                        sm:py-16
                    "
                >
                    <span className="text-5xl sm:text-6xl">
                        ✍️
                    </span>

                    <h2
                        className="
                            mt-5
                            text-lg font-semibold
                            text-[#08060d]
                        "
                    >
                        Nenhum autor cadastrado
                    </h2>

                    <p
                        className="
                            mt-2
                            max-w-sm
                            text-sm
                            leading-relaxed
                            text-[#6b6375]
                        "
                    >
                        Você ainda não possui autores cadastrados.
                        Adicione o primeiro autor para começar.
                    </p>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="
                            mt-6
                            w-full rounded-xl
                            bg-[#aa3bff]
                            px-5 py-3
                            text-sm font-semibold
                            text-white
                            shadow-md
                            shadow-purple-200
                            transition-all
                            hover:bg-[#9628e8]
                            hover:shadow-lg
                            hover:shadow-purple-200
                            active:scale-[0.99]
                            sm:w-auto
                        "
                    >
                        Adicionar primeiro autor
                    </button>
                </div>

            ) : (

                /* Lista */
                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#e5e4e7]
                        bg-white
                        shadow-[0_8px_30px_rgba(30,20,50,0.04)]
                    "
                >
                    {/* Cabeçalho da tabela */}
                    <div
                        className="
                            hidden
                            grid-cols-[1fr_auto]
                            items-center
                            gap-4
                            border-b
                            border-[#eeeef0]
                            bg-[#faf9fc]
                            px-5 py-4
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-[#9b95a2]
                            sm:grid
                        "
                    >
                        <span>Nome</span>
                        <span className="pr-2">
                            Ações
                        </span>
                    </div>

                    <div>
                        {authors.map((author, index) => (
                            <div
                                key={author.id}
                                className={`
flex flex-col
gap-4
px-5 py-4
transition-colors
hover:bg-[#faf9fc]
sm:grid
sm:grid-cols-[1fr_auto]
sm:items-center
sm:gap-4
${
    index !== authors.length - 1
        ? 'border-b border-[#eeeef0]'
        : ''
}
`}
                            >
                                {/* Nome */}
                                <div className="min-w-0">
                                    <span
                                        className="
                                            block
                                            truncate
                                            text-sm
                                            font-semibold
                                            text-[#08060d]
                                        "
                                    >
                                        {author.name}
                                    </span>
                                </div>

                                {/* Ações */}
                                <div
                                    className="
                                        flex
                                        w-full
                                        gap-2
                                        sm:w-auto
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEdit(author)
                                        }
                                        className="
                                            flex-1
                                            rounded-xl
                                            border
                                            border-[#e5e4e7]
                                            bg-white
                                            px-4 py-2.5
                                            text-sm
                                            font-semibold
                                            text-[#6b6375]
                                            transition-all
                                            hover:border-[#aa3bff]
                                            hover:bg-[#faf5ff]
                                            hover:text-[#aa3bff]
                                            active:scale-[0.99]
                                            sm:flex-none
                                        "
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeleteError('')
                                            setDeleteTarget(author)
                                        }}
                                        className="
                                            flex-1
                                            rounded-xl
                                            border
                                            border-[#f1d8dc]
                                            bg-white
                                            px-4 py-2.5
                                            text-sm
                                            font-semibold
                                            text-[#c25563]
                                            transition-all
                                            hover:border-[#e5aeb5]
                                            hover:bg-[#fff7f8]
                                            active:scale-[0.99]
                                            sm:flex-none
                                        "
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de criação/edição */}
            {showForm && (
                <Modal
                    title={
                        editAuthor
                            ? 'Editar Autor'
                            : 'Novo Autor'
                    }
                    onClose={() => setShowForm(false)}
                >
                    <form
                        onSubmit={handleFormSubmit}
                        noValidate
                        className="space-y-5"
                    >
                        {formError && (
                            <Alert message={formError} />
                        )}

                        <div>
                            <label
                                htmlFor="author-name"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-[#08060d]
                                "
                            >
                                Nome
                                <span className="text-[#c25563]">
                                    {' '}*
                                </span>
                            </label>

                            <input
                                id="author-name"
                                type="text"
                                value={formName}
                                onChange={(e) =>
                                    setFormName(e.target.value)
                                }
                                required
                                autoFocus
                                placeholder="Nome do autor"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#e5e4e7]
                                    bg-white
                                    px-4 py-3
                                    text-sm
                                    text-[#08060d]
                                    outline-none
                                    transition-all
                                    placeholder:text-[#aaa4b0]
                                    hover:border-[#c9c5cf]
                                    focus:border-[#aa3bff]
                                    focus:ring-4
                                    focus:ring-purple-100
                                "
                            />
                        </div>

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-[#eeeef0]
                                pt-5
                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#e5e4e7]
                                    bg-white
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-[#6b6375]
                                    transition-all
                                    hover:bg-[#faf9fc]
                                    hover:text-[#08060d]
                                    active:scale-[0.99]
                                    sm:w-auto
                                "
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={formSaving}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-[#aa3bff]
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-md
                                    shadow-purple-200
                                    transition-all
                                    hover:bg-[#9628e8]
                                    active:scale-[0.99]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    sm:w-auto
                                "
                            >
                                {formSaving
                                    ? 'Salvando…'
                                    : editAuthor
                                        ? 'Salvar'
                                        : 'Criar'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Modal de exclusão */}
            {deleteTarget && (
                <Modal
                    title="Confirmar exclusão"
                    onClose={() =>
                        setDeleteTarget(null)
                    }
                >
                    <div className="space-y-5">
                        <p
                            className="
                                text-sm
                                leading-relaxed
                                text-[#6b6375]
                            "
                        >
                            Excluir o autor{' '}
                            <strong
                                className="
                                    font-semibold
                                    text-[#08060d]
                                "
                            >
                                "{deleteTarget.name}"
                            </strong>
                            ? Os livros associados a ele
                            perderão esse vínculo.
                        </p>

                        {deleteError && (
                            <Alert message={deleteError} />
                        )}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-3
                                border-t
                                border-[#eeeef0]
                                pt-5
                                sm:flex-row
                                sm:justify-end
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#e5e4e7]
                                    bg-white
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-[#6b6375]
                                    transition-all
                                    hover:bg-[#faf9fc]
                                    hover:text-[#08060d]
                                    active:scale-[0.99]
                                    sm:w-auto
                                "
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="
                                    w-full
                                    rounded-xl
                                    bg-[#d95363]
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition-all
                                    hover:bg-[#c94454]
                                    active:scale-[0.99]
                                    sm:w-auto
                                "
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
