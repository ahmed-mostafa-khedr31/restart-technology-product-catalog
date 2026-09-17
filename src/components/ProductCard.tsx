import { useState } from 'react'
import type { Product } from '../api/types'
import { formatCategoryLabel, formatPrice } from '../catalog/params'
import type { CatalogLayout } from '../hooks/useCatalogLayout'
import { ImageLightbox } from './ImageLightbox'
import { ProductImage } from './ProductImage'
import { StarRating } from './StarRating'
import { StockBadge } from './StockBadge'

type ProductCardProps = {
  product: Product
  layout: CatalogLayout
  onOpen: (id: number) => void
  onDelete: (product: Product) => void
}

function DeleteButton({ product, onDelete }: { product: Product; onDelete: (product: Product) => void }) {
  return (
    <button
      type="button"
      className="product-card__delete"
      onClick={() => onDelete(product)}
      aria-label={`Delete ${product.title}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 7h16M10 11v6M14 11v6M6.2 7l.9 12.2A2 2 0 0 0 9.1 21h5.8a2 2 0 0 0 2-1.8L17.8 7M9 7V5.2A1.8 1.8 0 0 1 10.8 3.4h2.4A1.8 1.8 0 0 1 15 5.2V7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export function ProductCard({ product, layout, onOpen, onDelete }: ProductCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const previewSrc = product.images?.[0] ?? product.thumbnail

  return (
    <article className={`product-card product-card--${layout}`}>
      <div className="product-card__media">
        <ProductImage src={product.thumbnail} alt={product.title} />
        <button
          type="button"
          className="product-card__preview"
          onClick={() => setPreviewOpen(true)}
          aria-label={`View image for ${product.title}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 4H5v4M15 4h4v4M9 20H5v-4M15 20h4v-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <button
        type="button"
        className="product-card__main"
        onClick={() => onOpen(product.id)}
        aria-label={`View details for ${product.title}`}
      >
        <div className="product-card__body">
          <p className="product-card__meta">{formatCategoryLabel(product.category)}</p>
          <h2>{product.title}</h2>
          {layout === 'row' ? <StockBadge stock={product.stock} /> : null}
          <div className="product-card__footer">
            <p className="product-card__price">{formatPrice(product.price)}</p>
            <StarRating value={product.rating} />
          </div>
        </div>
      </button>
      {layout === 'grid' ? (
        <div className="product-card__overlays">
          <StockBadge stock={product.stock} />
          <DeleteButton product={product} onDelete={onDelete} />
        </div>
      ) : (
        <div className="product-card__actions">
          <DeleteButton product={product} onDelete={onDelete} />
        </div>
      )}
      {previewOpen ? (
        <ImageLightbox src={previewSrc} alt={product.title} onClose={() => setPreviewOpen(false)} />
      ) : null}
    </article>
  )
}
