import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProduct } from '../api/products'
import type { ProductPatch } from '../api/types'
import { useToast } from '../components/ToastProvider'
import { markProductUpdated } from './useProductList'

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const { notify } = useToast()

  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: ProductPatch }) => updateProduct(id, patch),
    onSuccess: (product, { patch }) => {
      markProductUpdated(queryClient, product, patch)
      notify('success', `${product.title} was updated.`)
    },
    onError: () => {
      notify('error', 'Could not update the product. Please try again.')
    },
  })
}
