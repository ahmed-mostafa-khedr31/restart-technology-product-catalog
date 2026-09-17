import { isInStock } from '../catalog/filters'

export function StockBadge({ stock }: { stock: number }) {
  const inStock = isInStock(stock)

  return (
    <span className={`stock-badge ${inStock ? 'stock-badge--in' : 'stock-badge--out'}`}>
      <span className="stock-badge__mark" aria-hidden="true" />
      <span>{inStock ? `In stock (${stock})` : 'Out of stock'}</span>
    </span>
  )
}
