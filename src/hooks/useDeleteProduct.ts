import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct } from '../api/products'
import { useToast } from '../components/ToastProvider'
import { markProductDeleted } from './useProductList'

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const { notify } = useToast()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (product) => {
      markProductDeleted(queryClient, product.id)
      notify('removed', `${product.title} was deleted.`)
    },
    onError: () => {
      notify('error', 'Could not delete the product. Please try again.')
    },
  })
}
