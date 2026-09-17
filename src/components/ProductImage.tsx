import { useState } from 'react'

type ProductImageProps = {
  src: string
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`product-image ${className ?? ''}`.trim()}>
      {failed ? (
        <div className="product-image__fallback" aria-hidden="true">
          No image
        </div>
      ) : (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      )}
    </div>
  )
}
