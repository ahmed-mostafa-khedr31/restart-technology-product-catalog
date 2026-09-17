import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { API_BASE } from '../api/client'
import { createProduct } from '../test/fixtures'
import { renderCatalog } from '../test/render'
import { HttpResponse, http, server } from '../test/server'

describe('client substring search', () => {
  it('shows phone products for a short query like "ph"', async () => {
    const mascara = createProduct({
      id: 1,
      title: 'Essence Mascara',
      description: 'Volumizing mascara',
      category: 'beauty',
      brand: 'Essence',
    })
    const phone = createProduct({
      id: 2,
      title: 'iPhone 15',
      description: 'A smartphone',
      category: 'smartphones',
      brand: 'Apple',
    })
    const laptop = createProduct({
      id: 8,
      title: 'MacBook Pro',
      description: 'A laptop computer',
      category: 'laptops',
      brand: 'Apple',
    })

    server.use(
      http.get(`${API_BASE}/products/search`, () => {
        return HttpResponse.json({ products: [], total: 0, skip: 0, limit: 12 })
      }),
      http.get(`${API_BASE}/products`, () => {
        return HttpResponse.json({
          products: [mascara, phone, laptop],
          total: 3,
          skip: 0,
          limit: 0,
        })
      }),
    )

    const user = userEvent.setup()
    renderCatalog()

    const input = await screen.findByLabelText('Search products')
    await user.type(input, 'ph')

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'iPhone 15' })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Essence Mascara' })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'MacBook Pro' })).not.toBeInTheDocument()
    })
  })
})
