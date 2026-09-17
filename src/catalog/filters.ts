import type { CatalogParams, Product, ProductUpdates } from '../api/types'

export function mergeProductUpdate(product: Product, updates: ProductUpdates): Product {
  const patch = updates[product.id]
  return patch ? { ...product, ...patch } : product
}

export function mergeProductUpdates(products: Product[], updates: ProductUpdates): Product[] {
  if (Object.keys(updates).length === 0) return products
  return products.map((product) => mergeProductUpdate(product, updates))
}

export function usesClientSearch(q: string): boolean {
  return q.trim().length > 0
}

export function matchesSearchQuery(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  const fields = [product.title, product.brand, product.category]
  return fields.some((field) => field?.toLowerCase().includes(needle))
}

export function applyLocalFilters(
  products: Product[],
  params: CatalogParams,
  deletedIds: number[],
): Product[] {
  const deleted = new Set(deletedIds)
  const searching = usesClientSearch(params.q)

  return products.filter((product) => {
    if (deleted.has(product.id)) return false
    if (params.stock === 'in' && product.stock <= 0) return false
    if (params.stock === 'out' && product.stock > 0) return false
    // DummyJSON cannot combine search + category; category is applied locally when q is set.
    if (searching && params.category && product.category !== params.category) return false
    if (searching && !matchesSearchQuery(product, params.q)) return false
    return true
  })
}

export function paginateProducts(products: Product[], page: number, pageSize: number): Product[] {
  const start = (Math.max(1, page) - 1) * pageSize
  return products.slice(start, start + pageSize)
}

export function isInStock(stock: number): boolean {
  return stock > 0
}
