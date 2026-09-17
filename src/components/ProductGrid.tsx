import type { Product } from '../api/types'
import type { CatalogLayout } from '../hooks/useCatalogLayout'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  layout: CatalogLayout
  pending: boolean
  onOpen: (id: number) => void
  onDelete: (product: Product) => void
}

export function ProductGrid({ products, layout, pending, onOpen, onDelete }: ProductGridProps) {
  return (
    <ul
      className={`product-grid product-grid--${layout} ${pending ? 'is-pending' : ''}`.trim()}
      aria-label="Products"
      aria-busy={pending}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} layout={layout} onOpen={onOpen} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}
