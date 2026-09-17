import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { ToastProvider } from './components/ToastProvider'
import { ProductsPage } from './pages/ProductsPage'
import { ThemeProvider } from './theme/ThemeProvider'

function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export function App() {
  return (
    <AppProviders>
      <div className="app-frame">
        <SiteHeader />
        <div className="app-frame__body">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </div>
        <SiteFooter />
      </div>
    </AppProviders>
  )
}
