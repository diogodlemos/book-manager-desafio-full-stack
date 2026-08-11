import { useEffect, useState, type FormEvent } from 'react'
import { booksApi } from '../api/books'
import { authorsApi } from '../api/authors'
import type { AuthorResponse, BookResponse } from '../types'
import { Alert } from './Alert'
import { extractApiError } from '../utils/error'
import { Loading } from './Loading'

interface Props {
  initial: BookResponse | null
  onSaved: (book: BookResponse) => void
  onCancel: () => void
}

export function BookForm({ initial, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [year, setYear] = useState(initial?.year?.toString() ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<Set<number>>(
    new Set(initial?.authors.map((a) => a.id) ?? [])
  )

  const [allAuthors, setAllAuthors] = useState<AuthorResponse[]>([])
  const [loadingAuthors, setLoadingAuthors] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    authorsApi.list()
      .then((data: any) =>
        setAllAuthors(
          [...data].sort((a, b) => a.name.localeCompare(b.name))
        )
      )
      .catch(() => setError('Erro ao carregar autores.'))
      .finally(() => setLoadingAuthors(false))
  }, [])

  function toggleAuthor(id: number) {
    setSelectedAuthorIds((prev) => {
      const next = new Set(prev)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (selectedAuthorIds.size === 0) {
      setError('Selecione pelo menos um autor.')
      return
    }

    setError('')
    setSaving(true)

    try {
      const payload = {
        title: title.trim(),
        year: year ? parseInt(year, 10) : null,
        description: description.trim() || null,
        authorIds: Array.from(selectedAuthorIds),
      }

      const saved = initial
        ? await booksApi.update(initial.id, payload)
        : await booksApi.create(payload)

      onSaved(saved)
    } catch (err) {
      setError(extractApiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {error && <Alert message={error} />}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-[#08060d]"
        >
          Título <span className="text-[#aa3bff]">*</span>
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Título do livro"
          disabled={saving}
          className="
            w-full rounded-xl border border-[#e5e4e7]
            bg-white px-4 py-3
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
      </div>

      <div>
        <label
          htmlFor="year"
          className="mb-2 block text-sm font-medium text-[#08060d]"
        >
          Ano de publicação
        </label>

        <input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Ex: 1899"
          min={1}
          max={new Date().getFullYear() + 5}
          disabled={saving}
          className="
            w-full rounded-xl border border-[#e5e4e7]
            bg-white px-4 py-3
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
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-[#08060d]"
        >
          Descrição
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Uma breve descrição..."
          rows={4}
          disabled={saving}
          className="
            w-full resize-y rounded-xl border border-[#e5e4e7]
            bg-white px-4 py-3
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
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-[#08060d]">
            Autores <span className="text-[#aa3bff]">*</span>
          </span>

          {selectedAuthorIds.size > 0 && (
            <span className="text-xs text-[#8b8492]">
              {selectedAuthorIds.size} selecionado(s)
            </span>
          )}
        </div>

        {loadingAuthors ? (
          <div className="flex min-h-24 items-center justify-center rounded-xl border border-[#e5e4e7] bg-[#faf9fc]">
            <Loading />
          </div>
        ) : allAuthors.length === 0 ? (
          <div className="rounded-xl border border-[#e5e4e7] bg-[#faf9fc] px-4 py-4 text-sm text-[#6b6375]">
            <p>
              Nenhum autor cadastrado.
            </p>

            <a
              href="/authors"
              className="mt-1 inline-block font-semibold text-[#aa3bff] transition hover:text-[#8e24d6]"
            >
              Cadastre autores primeiro
            </a>
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto rounded-xl border border-[#e5e4e7] bg-[#faf9fc] p-2">
            <div className="space-y-1">
              {allAuthors.map((author) => {
                const selected = selectedAuthorIds.has(author.id)

                return (
                  <label
                    key={author.id}
                    className={`
flex cursor-pointer items-center gap-3
rounded-lg px-3 py-2.5
text-sm
transition-colors
${
    selected
        ? 'bg-purple-50 text-[#08060d]'
        : 'text-[#6b6375] hover:bg-white'
}
`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAuthor(author.id)}
                      disabled={saving}
                      className="
                        h-4 w-4
                        cursor-pointer
                        rounded
                        border-[#d4d0d8]
                        text-[#aa3bff]
                        accent-[#aa3bff]
                        focus:ring-2
                        focus:ring-purple-100
                        disabled:cursor-not-allowed
                      "
                    />

                    <span className={selected ? 'font-medium text-[#08060d]' : ''}>
                      {author.name}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#eeeef0] pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="
            w-full rounded-xl
            border border-[#e5e4e7]
            bg-white
            px-5 py-3
            text-sm font-semibold
            text-[#6b6375]
            transition-all
            hover:border-[#c9c5cf]
            hover:bg-[#faf9fc]
            hover:text-[#08060d]
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl
            bg-[#aa3bff]
            px-5 py-3
            text-sm font-semibold
            text-white
            shadow-md shadow-purple-200
            transition-all
            hover:bg-[#9628e8]
            hover:shadow-lg hover:shadow-purple-200
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
          "
        >
          {saving && (
            <span
              className="
                h-4 w-4
                animate-spin
                rounded-full
                border-2
                border-white/30
                border-t-white
              "
            />
          )}

          {saving
            ? 'Salvando...'
            : initial
              ? 'Salvar alterações'
              : 'Criar livro'}
        </button>
      </div>
    </form>
  )
}
