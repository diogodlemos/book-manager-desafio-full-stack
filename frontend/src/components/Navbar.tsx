
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function isActive(path: string) {
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="border-b border-[#e5e4e7] bg-white shadow-[0_2px_12px_rgba(30,20,50,0.04)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">

        <Link
          to="/books"
          className="flex items-center justify-center gap-2 text-lg font-bold tracking-tight text-[#08060d] transition hover:text-[#aa3bff] lg:justify-start"
        >
          <span className="text-2xl">📚</span>
          <span>Book Manager</span>
        </Link>

        <div className="flex items-center justify-center gap-1 rounded-xl bg-[#faf9fc] p-1 sm:gap-2">
          <Link
            to="/books"
            className={`
rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4
${
    isActive('/books')
        ? 'bg-white text-[#aa3bff] shadow-sm'
        : 'text-[#6b6375] hover:bg-white hover:text-[#08060d]'
}
`}
          >
            Meus Livros
          </Link>

          <Link
            to="/authors"
            className={`
rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4
${
    isActive('/authors')
        ? 'bg-white text-[#aa3bff] shadow-sm'
        : 'text-[#6b6375] hover:bg-white hover:text-[#08060d]'
}
`}
          >
            Autores
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3 lg:justify-end">
          {user?.email && (
            <span
              className="max-w-[180px] truncate text-sm text-[#6b6375] sm:max-w-[240px]"
              title={user.email}
            >
              {user.email}
            </span>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="
              rounded-xl
              border border-[#e5e4e7]
              bg-white
              px-4 py-2
              text-sm font-semibold
              text-[#6b6375]
              transition-all
              hover:border-[#aa3bff]
              hover:bg-[#faf5ff]
              hover:text-[#aa3bff]
              active:scale-[0.98]
            "
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}
