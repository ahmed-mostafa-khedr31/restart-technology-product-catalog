import { PAGE_SIZE, apiFetch } from './client'
import type { CatalogParams, Product, ProductListResponse, ProductPatch, SortKey } from './types'

export const deletedProductIdsKey = ['deleted-product-ids'] as const
export const updatedProductsKey = ['updated-products'] as const

export function productListKey(params: CatalogParams) {
  const searching = Boolean(params.q.trim())
  return [
    'products',
    'list',
    {
      q: params.q,
      category: searching ? '' : params.category,
      sort: params.sort,
      page: searching ? 0 : params.page,
    },
  ] as const
}

export const categoryListKey = ['products', 'categories'] as const

export function productDetailsKey(id: number) {
  return ['products', 'details', id] as const
}

function sortQuery(sort: SortKey): { sortBy?: string; order?: 'asc' | 'desc' } {
  switch (sort) {
    case 'title-asc':
      return { sortBy: 'title', order: 'asc' }
    case 'title-desc':
      return { sortBy: 'title', order: 'desc' }
    case 'price-asc':
      return { sortBy: 'price', order: 'asc' }
    case 'price-desc':
      return { sortBy: 'price', order: 'desc' }
    case 'rating-desc':
      return { sortBy: 'rating', order: 'desc' }
    default:
      return {}
  }
}

export function buildProductListPath(params: CatalogParams): string {
  const search = new URLSearchParams()
  const sort = sortQuery(params.sort)
  if (sort.sortBy && sort.order) {
    search.set('sortBy', sort.sortBy)
    search.set('order', sort.order)
  }

  // DummyJSON /products/search does not substring-match short queries like "ph".
  // Fetch the full catalog and filter locally instead.
  if (params.q.trim()) {
    search.set('limit', '0')
    return `/products?${search.toString()}`
  }

  search.set('limit', String(PAGE_SIZE))
  search.set('skip', String((params.page - 1) * PAGE_SIZE))

  if (params.category) {
    return `/products/category/${encodeURIComponent(params.category)}?${search.toString()}`
  }

  return `/products?${search.toString()}`
}

export function fetchProductList(
  params: CatalogParams,
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  return apiFetch<ProductListResponse>(buildProductListPath(params), { signal })
}

export function fetchCategoryList(signal?: AbortSignal): Promise<string[]> {
  return apiFetch<string[]>('/products/category-list', { signal })
}

export function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { signal })
}

export function deleteProduct(id: number): Promise<Product & { isDeleted?: boolean }> {
  return apiFetch<Product & { isDeleted?: boolean }>(`/products/${id}`, {
    method: 'DELETE',
  })
}

export function updateProduct(id: number, patch: ProductPatch): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
}
