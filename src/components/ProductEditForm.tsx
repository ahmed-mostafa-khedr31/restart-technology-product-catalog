import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Product } from '../api/types'
import { useUpdateProduct } from '../hooks/useUpdateProduct'

type ProductEditFormProps = {
  product: Product
  editing: boolean
  onEditingChange: (editing: boolean) => void
}

export function ProductEditForm({ product, editing, onEditingChange }: ProductEditFormProps) {
  const updateMutation = useUpdateProduct()
  const [title, setTitle] = useState(product.title)
  const [price, setPrice] = useState(String(product.price))
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (editing) return
    setTitle(product.title)
    setPrice(String(product.price))
    setValidationError(null)
  }, [editing, product.price, product.title])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextTitle = title.trim()
    const nextPrice = Number(price)

    if (!nextTitle) {
      setValidationError('Title is required.')
      return
    }

    if (!Number.isFinite(nextPrice) || nextPrice < 0) {
      setValidationError('Enter a valid price.')
      return
    }

    const patch = {
      ...(nextTitle !== product.title ? { title: nextTitle } : {}),
      ...(nextPrice !== product.price ? { price: nextPrice } : {}),
    }

    if (Object.keys(patch).length === 0) {
      onEditingChange(false)
      return
    }

    setValidationError(null)

    try {
      await updateMutation.mutateAsync({ id: product.id, patch })
      onEditingChange(false)
    } catch {
      // Toast is shown by the mutation; keep the draft visible.
    }
  }

  if (!editing) {
    return (
      <div className="drawer__edit">
        <button
          type="button"
          className="button button--primary drawer__edit-toggle"
          onClick={() => onEditingChange(true)}
        >
          Edit product
        </button>
      </div>
    )
  }

  const pending = updateMutation.isPending

  return (
    <form className="drawer__edit" onSubmit={(event) => void handleSubmit(event)} noValidate>
      <p className="drawer__edit-heading">Update product</p>

      <div className="drawer__edit-fields">
        <label className="drawer__edit-field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={pending}
            autoComplete="off"
            aria-invalid={validationError === 'Title is required.'}
          />
        </label>

        <label className="drawer__edit-field">
          <span>Price</span>
          <input
            type="number"
            name="price"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            disabled={pending}
            aria-invalid={validationError === 'Enter a valid price.'}
          />
        </label>
      </div>

      {validationError ? (
        <p className="drawer__edit-error" role="alert">
          {validationError}
        </p>
      ) : null}

      <div className="drawer__edit-actions">
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onEditingChange(false)}
          disabled={pending}
        >
          Cancel
        </button>
        <button type="submit" className="button button--primary" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
