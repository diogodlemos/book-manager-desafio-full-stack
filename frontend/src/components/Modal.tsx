import { type ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        px-4 py-6
        backdrop-blur-sm
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-lg
          overflow-hidden
          rounded-2xl
          border border-[#e5e4e7]
          bg-white
          shadow-[0_20px_60px_rgba(30,20,50,0.15)]
        "
      >
        <div className="flex items-center justify-between border-b border-[#eeeef0] px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-[#08060d]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-lg
              text-[#8b8492]
              transition-all
              hover:bg-[#f7f3fa]
              hover:text-[#aa3bff]
              active:scale-95
            "
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
