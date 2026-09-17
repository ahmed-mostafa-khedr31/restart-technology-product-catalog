import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { PAGE_SIZE } from '../api/client'
import {
  categoryListKey,
  deletedProductIdsKey,
  fetchCategoryList,
  fetchProductList,
  productDetailsKey,
  productListKey,
  updatedProductsKey,
} from '../api/products'
import type {
  CatalogParams,
  Product,
  ProductListResponse,
  ProductPatch,
  ProductUpdates,
} from '../api/types'
import {
  applyLocalFilters,
  mergeProductUpdates,
  paginateProducts,
  usesClientSearch,
} from '../catalog/filters'

export function useDeletedProductIds() {
  return useQuery({
    queryKey: deletedProductIdsKey,
    queryFn: async () => [] as number[],
    initialData: [],
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export function useUpdatedProducts() {
  return useQuery({
    queryKey: updatedProductsKey,
    queryFn: async () => ({}) as ProductUpdates,
    initialData: {},
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export function useProductList(params: CatalogParams) {
  const deletedQuery = useDeletedProductIds()
  const updatedQuery = useUpdatedProducts()

  const listQuery = useQuery({
    queryKey: productListKey(params),
    queryFn: ({ signal }) => fetchProductList(params, signal),
    placeholderData: keepPreviousData,
  })

  const filtered = useMemo(() => {
    const merged = mergeProductUpdates(listQuery.data?.products ?? [], updatedQuery.data ?? {})
    return applyLocalFilters(merged, params, deletedQuery.data ?? [])
  }, [deletedQuery.data, listQuery.data?.products, params, updatedQuery.data])

  const searching = usesClientSearch(params.q)
  const products = searching ? paginateProducts(filtered, params.page, PAGE_SIZE) : filtered
  const total = searching
    ? filtered.length
    : Math.max(0, (listQuery.data?.total ?? 0) - (deletedQuery.data?.length ?? 0))

  return {
    products,
    total,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    hasLoadedData: listQuery.data !== undefined,
  }
}

export function useCategories() {
  return useQuery({
    queryKey: categoryListKey,
    queryFn: ({ signal }) => fetchCategoryList(signal),
    staleTime: 1000 * 60 * 10,
  })
}

export function markProductDeleted(queryClient: ReturnType<typeof useQueryClient>, id: number) {
  // DummyJSON DELETE is simulated and does not persist, so refetching would bring the row back.
  queryClient.setQueryData<number[]>(deletedProductIdsKey, (current = []) =>
    current.includes(id) ? current : [...current, id],
  )
  queryClient.setQueryData<ProductUpdates>(updatedProductsKey, (current = {}) => {
    if (!(id in current)) return current
    const next = { ...current }
    delete next[id]
    return next
  })
  queryClient.removeQueries({ queryKey: ['products', 'details', id] })
}

export function markProductUpdated(
  queryClient: ReturnType<typeof useQueryClient>,
  product: Product,
  patch: ProductPatch,
) {
  // DummyJSON PATCH is simulated and does not persist, so refetching would restore the original fields.
  const overlay: ProductPatch = {
    ...(patch.title !== undefined ? { title: product.title } : {}),
    ...(patch.price !== undefined ? { price: product.price } : {}),
  }

  queryClient.setQueryData<ProductUpdates>(updatedProductsKey, (current = {}) => ({
    ...current,
    [product.id]: { ...current[product.id], ...overlay },
  }))

  queryClient.setQueryData<Product>(productDetailsKey(product.id), (current) =>
    current ? { ...current, ...overlay } : { ...product, ...overlay },
  )

  queryClient.setQueriesData<ProductListResponse>({ queryKey: ['products', 'list'] }, (current) => {
    if (!current) return current
    return {
      ...current,
      products: current.products.map((item) => (item.id === product.id ? { ...item, ...overlay } : item)),
    }
  })
}
