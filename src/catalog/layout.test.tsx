import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderCatalog } from '../test/render'

describe('catalog layout', () => {
  it('switches the product list between grid and row views', async () => {
    const user = userEvent.setup()
    renderCatalog()

    expect(await screen.findByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument()

    const list = screen.getByRole('list', { name: 'Products' })
    expect(list).toHaveClass('product-grid--grid')
    expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Row view' }))

    expect(list).toHaveClass('product-grid--row')
    expect(screen.getByRole('button', { name: 'Row view' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'false')
  })
})
