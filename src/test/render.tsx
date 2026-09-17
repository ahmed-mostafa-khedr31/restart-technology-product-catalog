import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ToastProvider } from '../components/ToastProvider'
import { ProductsPage } from '../pages/ProductsPage'
import { ThemeProvider } from '../theme/ThemeProvider'

function LocationProbe() {
  const location = useLocation()
  return <div data-testid="location-search">{location.search}</div>
}

export function renderCatalog(initialPath = '/products') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const view = render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <MemoryRouter
            initialEntries={[initialPath]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <LocationProbe />
            <Routes>
              <Route path="/products" element={<ProductsPage />} />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  )

  return { ...view, queryClient }
}
