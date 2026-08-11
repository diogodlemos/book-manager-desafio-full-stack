import { Alert } from '../components/Alert.tsx'
import { useEffect, useState } from 'react'
import type { BookResponse } from '../types'
import { Loading } from '../components/Loading.tsx'
import { booksApi } from '../api/books.ts'
import { extractApiError } from '../utils/error.ts'
import { Modal } from '../components/Modal.tsx'
import { useNavigate } from 'react-router-dom'


export function BooksPage() {
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState<BookResponse[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')

  const PAGE_SIZE = 9

  const [deleteConfirm, setDeleteConfirm] =
    useState<BookResponse | null>(null)

  const [deleteError, setDeleteError] = useState('')

  async function fetchBooks(pageNumber = 0, searchTerm = search) {
    try {
      setError('')
      setLoading(true)

      const data = await booksApi.list(
          pageNumber,
          PAGE_SIZE,
          searchTerm
      )

      setBooks(data.content)
      setPage(data.number)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchBooks(page, search)
  }, [page])

  function BookCard({
    book,
    onEdit,
    onDelete,
  }: {
    book: BookResponse
    onEdit: () => void
    onDelete: () => void
  }) {
    const sortedAuthors = [...book.authors].sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    return (
      <article
        className="
          flex h-full flex-col
          rounded-2xl
          border border-[#e5e4e7]
          bg-white
          p-5
          shadow-[0_8px_30px_rgba(30,20,50,0.04)]
          transition-all
          hover:-translate-y-0.5
          hover:shadow-[0_12px_35px_rgba(30,20,50,0.08)]
        "
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-lg font-semibold leading-snug text-[#08060d]">
            {book.title}
          </h3>

          {book.year && (
            <span
              className="
                shrink-0 rounded-lg
                bg-[#faf5ff]
                px-2.5 py-1
                text-xs font-medium
                text-[#8e24d6]
              "
            >
              {book.year}
            </span>
          )}
        </div>

        {book.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#6b6375]">
            {book.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {sortedAuthors.length > 0 ? (
            sortedAuthors.map((author) => (
              <span
                key={author.id}
                className="
                  rounded-full
                  border border-[#e5e4e7]
                  bg-[#faf9fc]
                  px-2.5 py-1
                  text-xs font-medium
                  text-[#6b6375]
                "
              >
                {author.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#9b95a2]">
              Sem autores
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={onEdit}
            className="
              w-full rounded-xl
              border border-[#e5e4e7]
              bg-white
              px-4 py-2.5
              text-sm font-semibold
              text-[#6b6375]
              transition-all
              hover:border-[#aa3bff]
              hover:bg-[#faf5ff]
              hover:text-[#aa3bff]
              active:scale-[0.99]
              sm:w-auto sm:flex-1
            "
          >
            Editar
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="
              w-full rounded-xl
              border border-[#f1d8dc]
              bg-white
              px-4 py-2.5
              text-sm font-semibold
              text-[#c25563]
              transition-all
              hover:border-[#e5aeb5]
              hover:bg-[#fff7f8]
              active:scale-[0.99]
              sm:w-auto sm:flex-1
            "
          >
            Excluir
          </button>
        </div>
      </article>
    )
  }

  async function handleDelete() {
    if (!deleteConfirm) return

    try {
      await booksApi.delete(deleteConfirm.id)

      if (books.length === 1 && page > 0) {
        setPage((prev) => prev - 1)
      } else {
        await fetchBooks(page)
      }

      setDeleteConfirm(null)
    } catch (err) {
      setDeleteError(extractApiError(err))
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="
          mb-6 flex flex-col gap-4
          sm:flex-row sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#08060d] sm:text-3xl">
            Meus Livros
          </h1>

          <p className="mt-1 text-sm text-[#6b6375]">
            Gerencie sua biblioteca de livros.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void navigate('/books/new')}
          className="
            w-full rounded-xl
            bg-[#aa3bff]
            px-5 py-3
            text-sm font-semibold
            text-white
            shadow-md shadow-purple-200
            transition-all
            hover:bg-[#9628e8]
            hover:shadow-lg hover:shadow-purple-200
            active:scale-[0.99]
            sm:w-auto
          "
        >
          + Novo Livro
        </button>
      </div>

      <div
          className="
        mb-6
        rounded-2xl
        border border-[#e5e4e7]
        bg-white
        p-4
        shadow-[0_8px_30px_rgba(30,20,50,0.03)]
        sm:p-5
    "
      >
        <div className="mb-3">
          <label
              htmlFor="book-search"
              className="
                block
                text-sm font-semibold
                text-[#08060d]
            "
          >
            Buscar livros
          </label>

          <p className="mt-1 text-xs text-[#9b95a2]">
            Pesquise pelo título do livro.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <span
                className="
                    pointer-events-none
                    absolute left-4 top-1/2
                    -translate-y-1/2
                    text-base
                    text-[#9b95a2]
                "
                aria-hidden="true"
            >
                🔍
            </span>

            <input
                id="book-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void fetchBooks(0, search)
                  }
                }}
                placeholder="Digite o título do livro..."
                className="
                    w-full
                    rounded-xl
                    border border-[#e5e4e7]
                    bg-[#faf9fc]
                    py-3
                    pl-11
                    pr-10
                    text-sm
                    text-[#08060d]
                    outline-none
                    transition-all

                    placeholder:text-[#aaa4b0]

                    hover:border-[#c9c5cf]

                    focus:border-[#aa3bff]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-purple-100
                "
            />

            {search && (
                <button
                    type="button"
                    onClick={() => {
                      setSearch('')
                      void fetchBooks(0, '')
                    }}
                    className="
                        absolute right-3 top-1/2
                        flex h-7 w-7
                        -translate-y-1/2
                        items-center justify-center
                        rounded-lg
                        text-[#9b95a2]
                        transition
                        hover:bg-[#f0edf2]
                        hover:text-[#6b6375]
                    "
                    aria-label="Limpar busca"
                >
                  ✕
                </button>
            )}
          </div>

          <button
              type="button"
              disabled={loading}
              onClick={() => void fetchBooks(0, search)}
              className="
                w-full
                rounded-xl
                bg-[#aa3bff]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-md
                shadow-purple-200
                transition-all

                hover:bg-[#9628e8]
                hover:shadow-lg
                hover:shadow-purple-200

                active:scale-[0.99]

                disabled:cursor-not-allowed
                disabled:opacity-60

                sm:w-auto
                sm:min-w-[110px]
            "
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {search && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#8b8492]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#aa3bff]" />

              <span>
                Buscando por:{' '}
                <strong className="font-semibold text-[#6b6375]">
                    "{search}"
                </strong>
            </span>
            </div>
        )}
      </div>


      {error && <Alert message={error} />}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loading />
        </div>
      ) : books.length === 0 ? (
        <div
          className="
            flex flex-col items-center justify-center
            rounded-2xl
            border border-dashed border-[#d9d5dd]
            bg-white
            px-5 py-12
            text-center
            shadow-[0_8px_30px_rgba(30,20,50,0.03)]
            sm:px-8 sm:py-16
          "
        >
          <span className="text-5xl sm:text-6xl">
            📖
          </span>

          <h2 className="mt-5 text-lg font-semibold text-[#08060d]">
            Sua biblioteca está vazia
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6b6375]">
            Você ainda não tem livros cadastrados. Adicione seu primeiro livro
            para começar a montar sua biblioteca.
          </p>

          <button
            type="button"
            onClick={() => void navigate('/books/new')}
            className="
              mt-6
              w-full rounded-xl
              bg-[#aa3bff]
              px-5 py-3
              text-sm font-semibold
              text-white
              shadow-md shadow-purple-200
              transition-all
              hover:bg-[#9628e8]
              active:scale-[0.99]
              sm:w-auto
            "
          >
            Adicionar primeiro livro
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#6b6375]">
              {totalElements === 1
                ? '1 livro encontrado'
                : `${totalElements} livros encontrados`}
            </p>

            <p className="text-sm text-[#9b95a2]">
              Página {page + 1} de {totalPages}
            </p>
          </div>

          {/* Grid */}
          <div
            className="
              grid grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={() => void navigate(`/books/${book.id}/edit`)}
                onDelete={() => {
                  setDeleteError('')
                  setDeleteConfirm(book)
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div
              className="
                mt-8 flex flex-col
                items-center justify-between
                gap-4
                border-t border-[#eeeef0]
                pt-6
                sm:flex-row
              "
            >
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                className="
                  w-full rounded-xl
                  border border-[#e5e4e7]
                  bg-white
                  px-4 py-2.5
                  text-sm font-semibold
                  text-[#6b6375]
                  transition-all
                  hover:border-[#aa3bff]
                  hover:bg-[#faf5ff]
                  hover:text-[#aa3bff]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  sm:w-auto
                "
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`
h-9 min-w-9 rounded-lg
px-2
text-sm font-semibold
transition-all
${
    pageNumber === page
        ? 'bg-[#aa3bff] text-white shadow-sm'
        : 'text-[#6b6375] hover:bg-[#faf5ff] hover:text-[#aa3bff]'
}
`}
                  >
                    {pageNumber + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
                className="
                  w-full rounded-xl
                  border border-[#e5e4e7]
                  bg-white
                  px-4 py-2.5
                  text-sm font-semibold
                  text-[#6b6375]
                  transition-all
                  hover:border-[#aa3bff]
                  hover:bg-[#faf5ff]
                  hover:text-[#aa3bff]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  sm:w-auto
                "
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}

      {deleteConfirm && (
        <Modal
          title="Confirmar exclusão"
          onClose={() => setDeleteConfirm(null)}
        >
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-[#6b6375]">
              Tem certeza que deseja excluir{' '}
              <strong className="font-semibold text-[#08060d]">
                "{deleteConfirm.title}"
              </strong>
              ? Esta ação não pode ser desfeita.
            </p>

            {deleteError && <Alert message={deleteError} />}

            <div
              className="
                flex flex-col-reverse gap-3
                border-t border-[#eeeef0]
                pt-5
                sm:flex-row sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="
                  w-full rounded-xl
                  border border-[#e5e4e7]
                  bg-white
                  px-5 py-3
                  text-sm font-semibold
                  text-[#6b6375]
                  transition-all
                  hover:bg-[#faf9fc]
                  hover:text-[#08060d]
                  sm:w-auto
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="
                  w-full rounded-xl
                  bg-[#d95363]
                  px-5 py-3
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-[#c94454]
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
