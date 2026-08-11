import { useNavigate } from 'react-router-dom'
import { BookForm } from '../components/BookForm'
import type { BookResponse } from '../types'

export function BookNewPage() {
  const navigate = useNavigate()

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
          Novo Livro
        </h1>

        <p className="mt-1 text-sm text-[#6b6375]">
          Preencha os dados para adicionar um livro à sua biblioteca.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e5e4e7] bg-white p-6 shadow-[0_8px_30px_rgba(30,20,50,0.04)] sm:p-8">
        <BookForm
          initial={null}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
