import type { CatalogParams, SortKey, StockFilter } from '../api/types'

const SORT_KEYS: SortKey[] = [
  'relevance',
  'title-asc',
  'title-desc',
  'price-asc',
  'price-desc',
  'rating-desc',
]

function parseStock(value: string | null): StockFilter {
  if (value === 'in' || value === 'out') return value
  return 'all'
}

function parseSort(value: string | null): SortKey {
  if (value && SORT_KEYS.includes(value as SortKey)) return value as SortKey
  return 'relevance'
}

export function parseCatalogParams(searchParams: URLSearchParams): CatalogParams {
  const page = Number(searchParams.get('page') ?? '1')

  return {
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    stock: parseStock(searchParams.get('stock')),
    sort: parseSort(searchParams.get('sort')),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function toSearchParams(params: CatalogParams): URLSearchParams {
  const search = new URLSearchParams()

  if (params.q) search.set('q', params.q)
  if (params.category) search.set('category', params.category)
  if (params.stock !== 'all') search.set('stock', params.stock)
  if (params.sort !== 'relevance') search.set('sort', params.sort)
  if (params.page > 1) search.set('page', String(params.page))

  return search
}

export function formatCategoryLabel(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatProductCount(total: number): string {
  return `${new Intl.NumberFormat('en-US').format(total)} ${total === 1 ? 'product' : 'products'}`
}
