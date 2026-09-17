import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from '../components/SiteHeader'
import { ThemeProvider } from './ThemeProvider'

describe('theme', () => {
  it('toggles dark mode from the header and persists it', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SiteHeader />
        </MemoryRouter>
      </ThemeProvider>,
    )

    const toggle = screen.getByRole('button', { name: 'Switch to dark mode' })
    await user.click(toggle)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
