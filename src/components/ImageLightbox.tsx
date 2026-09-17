import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { useDialogFocus } from '../hooks/useDialogFocus'

type ImageLightboxProps = {
  src: string
  alt: string
  onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const ref = useRef<HTMLDivElement>(null)
  useDialogFocus(true, ref, onClose)

  return createPortal(
    <div className="overlay overlay--lightbox" onClick={onClose}>
      <div className="overlay__backdrop" aria-hidden="true" />
      <div
        ref={ref}
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close image">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <img src={src} alt={alt} />
      </div>
    </div>,
    document.body,
  )
}
