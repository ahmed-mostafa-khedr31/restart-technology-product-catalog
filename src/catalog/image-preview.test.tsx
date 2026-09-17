import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderCatalog } from '../test/render'

describe('product image preview', () => {
  it('opens the product photo in a lightbox', async () => {
    const user = userEvent.setup()
    renderCatalog()

    expect(await screen.findByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Essence Mascara' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View image for Essence Mascara' }))

    const dialog = screen.getByRole('dialog', { name: 'Essence Mascara' })
    expect(dialog).toBeInTheDocument()
    expect(dialog.querySelector('img')).toHaveAttribute('alt', 'Essence Mascara')

    await user.click(screen.getByRole('button', { name: 'Close image' }))
    expect(screen.queryByRole('dialog', { name: 'Essence Mascara' })).not.toBeInTheDocument()
  })
})
