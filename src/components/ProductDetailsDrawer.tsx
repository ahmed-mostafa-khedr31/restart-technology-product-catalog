import { useEffect, useRef, useState } from 'react'
import { formatCategoryLabel, formatPrice } from '../catalog/params'
import { useDialogFocus } from '../hooks/useDialogFocus'
import { useProductDetails } from '../hooks/useProductDetails'
import { ProductEditForm } from './ProductEditForm'
import { ProductImage } from './ProductImage'
import { StarRating } from './StarRating'
import { ErrorState } from './States'
import { StockBadge } from './StockBadge'

type ProductDetailsDrawerProps = {
  productId: number
  onClose: () => void
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="drawer__close" onClick={onClick} aria-label="Close details">
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
  )
}

export function ProductDetailsDrawer({ productId, onClose }: ProductDetailsDrawerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const query = useProductDetails(productId)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setEditing(false)
  }, [productId])

  function handleClose() {
    if (editing) {
      setEditing(false)
      return
    }
    onClose()
  }

  useDialogFocus(true, ref, handleClose)

  const product = query.data

  return (
    <div className="overlay overlay--drawer" onClick={handleClose}>
      <aside
        ref={ref}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        {query.isLoading ? (
          <>
            <header className="drawer__top">
              <div className="drawer__top-copy">
                <p className="drawer__eyebrow">Product details</p>
                <p className="drawer__sku">Fetching item</p>
              </div>
              <CloseButton onClick={handleClose} />
            </header>
            <div className="drawer__body drawer__body--loading" aria-busy="true">
              <div className="drawer__hero skeleton" />
              <div className="drawer__story">
                <div className="skeleton skeleton-line skeleton-line--chip" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line skeleton-line--short" />
                <div className="drawer__stats">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line" />
                </div>
              </div>
              <h2 id="product-details-title" className="visually-hidden">
                Product details
              </h2>
              <p className="visually-hidden">Loading product details</p>
            </div>
          </>
        ) : null}

        {query.isError ? (
          <>
            <header className="drawer__top">
              <div className="drawer__top-copy">
                <p className="drawer__eyebrow">Product details</p>
                <p className="drawer__sku">Could not load</p>
              </div>
              <CloseButton onClick={handleClose} />
            </header>
            <div className="drawer__body drawer__body--state">
              <h2 id="product-details-title">Product details</h2>
              <ErrorState
                title="Could not load product"
                detail="The product details request failed."
                onRetry={() => {
                  void query.refetch()
                }}
              />
            </div>
          </>
        ) : null}

        {product ? (
          <>
            <header className="drawer__top">
              <div className="drawer__top-copy">
                <p className="drawer__eyebrow">Product details</p>
                <p className="drawer__sku">SKU {String(product.id).padStart(4, '0')}</p>
              </div>
              <CloseButton onClick={handleClose} />
            </header>

            <div className="drawer__body">
              <div className="drawer__hero">
                <ProductImage src={product.thumbnail} alt={product.title} className="drawer__photo" />
              </div>

              <div className="drawer__story">
                <span className="drawer__chip">{formatCategoryLabel(product.category)}</span>
                <h2 id="product-details-title">{product.title}</h2>
                <p className="drawer__brand">{product.brand ?? 'Unknown brand'}</p>

                <dl className="drawer__stats">
                  <div>
                    <dt>Rating</dt>
                    <dd>
                      <StarRating value={product.rating} size="md" />
                    </dd>
                  </div>
                  <div>
                    <dt>Availability</dt>
                    <dd>
                      <StockBadge stock={product.stock} />
                    </dd>
                  </div>
                </dl>

                <section className="drawer__about">
                  <h3>About</h3>
                  <p className="details-description">{product.description}</p>
                </section>
              </div>
            </div>

            <footer className="drawer__dock">
              {editing ? null : (
                <div className="drawer__buy">
                  <p className="drawer__price-label">Price</p>
                  <p className="drawer__price">{formatPrice(product.price)}</p>
                </div>
              )}
              <ProductEditForm product={product} editing={editing} onEditingChange={setEditing} />
            </footer>
          </>
        ) : null}
      </aside>
    </div>
  )
}
