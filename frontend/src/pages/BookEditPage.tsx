import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookForm } from '../components/BookForm'
import { booksApi } from '../api/books'
import type { BookResponse } from '../types'
import { Loading } from '../components/Loading'
import { Alert } from '../components/Alert'
import { extractApiError } from '../utils/error'

export function BookEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [book, setBook] = useState<BookResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    booksApi.getById(Number(id))
      .then(setBook)
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setLoading(false))
  }, [id])

  function handleSaved(_book: BookResponse) {
    void navigate('/books')
  }

  function handleCancel() {
    void navigate('/books')
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#08060d] sm:text-3xl">
          Editar Livro
        </h1>

        <p className="mt-1 text-sm text-[#6b6375]">
          Altere os dados do livro e salve as mudanças.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loading />
        </div>
      ) : error ? (
        <Alert message={error} />
      ) : book ? (
        <div className="rounded-2xl border border-[#e5e4e7] bg-white p-6 shadow-[0_8px_30px_rgba(30,20,50,0.04)] sm:p-8">
          <BookForm
            initial={book}
            onSaved={handleSaved}
            onCancel={handleCancel}
          />
        </div>
      ) : null}
    </div>
  )
}
