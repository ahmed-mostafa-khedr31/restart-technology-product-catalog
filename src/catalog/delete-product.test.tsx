import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { API_BASE } from '../api/client'
import { renderCatalog } from '../test/render'
import { HttpResponse, http, server } from '../test/server'

describe('delete product', () => {
  it('removes a product after a successful delete', async () => {
    const user = userEvent.setup()
    renderCatalog()

    expect(await screen.findByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delete Essence Mascara' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Essence Mascara' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('status', { name: /was deleted/i })).toHaveTextContent(
      'Essence Mascara was deleted.',
    )
  })

  it('keeps the product visible when delete fails', async () => {
    server.use(
      http.delete(`${API_BASE}/products/:id`, () => {
        return HttpResponse.json({ message: 'failed' }, { status: 500 })
      }),
    )

    const user = userEvent.setup()
    renderCatalog()

    expect(await screen.findByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Delete Essence Mascara' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not delete the product')
    expect(screen.getByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument()
  })
})
