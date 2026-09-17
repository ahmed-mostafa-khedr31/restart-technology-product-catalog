import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { API_BASE } from '../api/client'
import { formatPrice } from '../catalog/params'
import { mascara } from '../test/fixtures'
import { renderCatalog } from '../test/render'
import { HttpResponse, http, server } from '../test/server'

describe('update product', () => {
  it('patches a product and keeps the overlay after DummyJSON would revert', async () => {
    const user = userEvent.setup()
    const patchRequests: Array<{ method: string; title?: string; price?: number }> = []

    server.use(
      http.patch(`${API_BASE}/products/:id`, async ({ request }) => {
        const body = (await request.json()) as { title?: string; price?: number }
        patchRequests.push({ method: request.method, ...body })
        return HttpResponse.json({
          ...mascara,
          title: body.title ?? mascara.title,
          price: body.price ?? mascara.price,
        })
      }),
    )

    const { queryClient } = renderCatalog()

    expect(await screen.findByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View details for Essence Mascara' }))
    await user.click(await screen.findByRole('button', { name: 'Edit product' }))

    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    const priceInput = screen.getByRole('spinbutton', { name: 'Price' })
    fireEvent.change(titleInput, { target: { value: 'Essence Mascara Remix' } })
    fireEvent.change(priceInput, { target: { value: '12.5' } })
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    await waitFor(() => {
      expect(patchRequests).toEqual([{ method: 'PATCH', title: 'Essence Mascara Remix', price: 12.5 }])
    })

    expect(await screen.findByRole('status', { name: /was updated/i })).toHaveTextContent(
      'Essence Mascara Remix was updated.',
    )
    expect(screen.getAllByRole('heading', { name: 'Essence Mascara Remix' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText(formatPrice(12.5)).length).toBeGreaterThan(0)
    expect(screen.queryByRole('heading', { name: 'Essence Mascara' })).not.toBeInTheDocument()

    await queryClient.invalidateQueries({ queryKey: ['products', 'list'] })
    await queryClient.invalidateQueries({ queryKey: ['products', 'details'] })

    await waitFor(() => {
      expect(screen.getAllByRole('heading', { name: 'Essence Mascara Remix' }).length).toBeGreaterThan(0)
    })
    expect(screen.getAllByText(formatPrice(12.5)).length).toBeGreaterThan(0)
  })

  it('keeps the original product when patch fails', async () => {
    server.use(
      http.patch(`${API_BASE}/products/:id`, () => {
        return HttpResponse.json({ message: 'failed' }, { status: 500 })
      }),
    )

    const user = userEvent.setup()
    renderCatalog()

    expect(await screen.findByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View details for Essence Mascara' }))
    await user.click(await screen.findByRole('button', { name: 'Edit product' }))

    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    fireEvent.change(titleInput, { target: { value: 'Should Not Stick' } })
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not update the product')
    expect(screen.getAllByRole('heading', { name: 'Essence Mascara' }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('heading', { name: 'Should Not Stick' })).not.toBeInTheDocument()
  })
})
