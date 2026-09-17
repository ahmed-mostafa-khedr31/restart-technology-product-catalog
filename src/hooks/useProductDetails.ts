import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProduct, productDetailsKey } from '../api/products'
import { mergeProductUpdate } from '../catalog/filters'
import { useUpdatedProducts } from './useProductList'

export function useProductDetails(id: number | null) {
  const updatesQuery = useUpdatedProducts()

  const query = useQuery({
    queryKey: productDetailsKey(id ?? 0),
    queryFn: ({ signal }) => fetchProduct(id!, signal),
    enabled: id !== null,
  })

  const data = useMemo(() => {
    if (!query.data) return query.data
    return mergeProductUpdate(query.data, updatesQuery.data ?? {})
  }, [query.data, updatesQuery.data])

  return { ...query, data }
}
