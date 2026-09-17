export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  rating: number
  stock: number
  brand?: string
  thumbnail: string
  images?: string[]
  availabilityStatus?: string
}

export type ProductPatch = {
  title?: string
  price?: number
}

export type ProductUpdates = Record<number, ProductPatch>

export type ProductListResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type StockFilter = 'all' | 'in' | 'out'

export type SortKey =
  | 'relevance'
  | 'title-asc'
  | 'title-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'

export type CatalogParams = {
  q: string
  category: string
  stock: StockFilter
  sort: SortKey
  page: number
}
