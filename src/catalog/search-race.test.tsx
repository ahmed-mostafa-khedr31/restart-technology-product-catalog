import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { API_BASE } from '../api/client'
import { createProduct } from '../test/fixtures'
import { renderCatalog } from '../test/render'
import { HttpResponse, delay, http, server } from '../test/server'

describe('debounced search race handling', () => {
  it('does not let a slower previous search overwrite later results', async () => {
    const user = userEvent.setup()
    const oldResult = createProduct({ id: 11, title: 'Old Ph Match' })
    const newResult = createProduct({ id: 12, title: 'iPhone 15 Pro' })
    const catalog = [oldResult, newResult]
    let fullCatalogFetches = 0

    server.use(
      http.get(`${API_BASE}/products`, async ({ request }) => {
        const limit = new URL(request.url).searchParams.get('limit')
        if (limit === '0') {
          fullCatalogFetches += 1
          if (fullCatalogFetches === 1) await delay(800)
        }

        return HttpResponse.json({
          products: catalog,
          total: catalog.length,
          skip: 0,
          limit: limit === '0' ? 0 : 12,
        })
      }),
    )

    renderCatalog()
    const input = await screen.findByLabelText('Search products')
    await user.type(input, 'ph')
    await waitFor(() => {
      expect(screen.getByTestId('location-search')).toHaveTextContent('q=ph')
    })
    await user.type(input, 'one')

    expect(await screen.findByRole('heading', { name: 'iPhone 15 Pro' })).toBeInTheDocument()
    await delay(900)
    expect(screen.queryByRole('heading', { name: 'Old Ph Match' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'iPhone 15 Pro' })).toBeInTheDocument()
  })
})
