import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { API_BASE } from '../api/client'
import { StockBadge } from '../components/StockBadge'
import { renderCatalog } from '../test/render'
import { HttpResponse, http, server } from '../test/server'

describe('empty and error states', () => {
  it('shows an empty state when the catalog has no results', async () => {
    server.use(
      http.get(`${API_BASE}/products`, () => {
        return HttpResponse.json({ products: [], total: 0, skip: 0, limit: 12 })
      }),
    )

    renderCatalog()
    expect(await screen.findByRole('status')).toHaveTextContent('No products found')
  })

  it('shows a recoverable error state with retry', async () => {
    let shouldFail = true
    server.use(
      http.get(`${API_BASE}/products`, () => {
        if (shouldFail) {
          shouldFail = false
          return HttpResponse.json({ message: 'failed' }, { status: 500 })
        }
        return HttpResponse.json({
          products: [],
          total: 0,
          skip: 0,
          limit: 12,
        })
      }),
    )

    const user = userEvent.setup()
    renderCatalog()

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong')
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByRole('status')).toHaveTextContent('No products found')
  })
})

describe('StockBadge', () => {
  it('communicates stock with text, not color alone', () => {
    const { rerender } = render(<StockBadge stock={8} />)
    expect(screen.getByText('In stock (8)')).toBeInTheDocument()

    rerender(<StockBadge stock={0} />)
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
  })
})
