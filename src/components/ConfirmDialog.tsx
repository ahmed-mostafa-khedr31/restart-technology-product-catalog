import { useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Product } from '../api/types'
import { useDialogFocus } from '../hooks/useDialogFocus'

type ConfirmDialogProps = {
  product: Product
  pending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ product, pending, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  useDialogFocus(true, ref, onCancel)

  return createPortal(
    <div className="overlay overlay--dialog" onClick={onCancel}>
      <div className="overlay__backdrop" aria-hidden="true" />
      <div
        ref={ref}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-copy"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="dialog__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M4 7h16M10 11v6M14 11v6M6.2 7l.9 12.2A2 2 0 0 0 9.1 21h5.8a2 2 0 0 0 2-1.8L17.8 7M9 7V5.2A1.8 1.8 0 0 1 10.8 3.4h2.4A1.8 1.8 0 0 1 15 5.2V7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h2 id="confirm-title">Delete product</h2>
        <p id="confirm-copy">This item will be removed from the current catalog view.</p>

        <div className="dialog__product">
          <img src={product.thumbnail} alt={product.title} width={48} height={48} />
          <p>{product.title}</p>
        </div>

        <div className="dialog__actions">
          <button type="button" className="button" onClick={onCancel} disabled={pending}>
            Cancel
          </button>
          <button
            type="button"
            className="button button--danger-solid"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
