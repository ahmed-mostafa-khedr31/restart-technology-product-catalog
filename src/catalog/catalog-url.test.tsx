import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderCatalog } from '../test/render'

describe('catalog URL state', () => {
  it('keeps filters in the URL and resets page when filters change', async () => {
    const user = userEvent.setup()
    renderCatalog('/products?q=phone&stock=in&sort=price-desc&page=2')

    expect(await screen.findByDisplayValue('phone')).toBeInTheDocument()
    expect(screen.getByLabelText('Stock')).toHaveValue('in')
    expect(screen.getByLabelText('Sort')).toHaveValue('price-desc')
    await screen.findByRole('option', { name: 'Smartphones' })

    await user.selectOptions(screen.getByLabelText('Category'), 'smartphones')

    await waitFor(() => {
      const search = screen.getByTestId('location-search').textContent ?? ''
      expect(search).toContain('q=phone')
      expect(search).toContain('category=smartphones')
      expect(search).toContain('stock=in')
      expect(search).toContain('sort=price-desc')
      expect(search).not.toContain('page=')
    })

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    await waitFor(() => {
      expect(screen.getByTestId('location-search')).toHaveTextContent('')
    })
    expect(screen.getByLabelText('Search products')).toHaveValue('')
  })
})
