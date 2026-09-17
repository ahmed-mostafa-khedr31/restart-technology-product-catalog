import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CatalogParams } from '../api/types'
import { parseCatalogParams, toSearchParams } from '../catalog/params'

export function useCatalogParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(() => parseCatalogParams(searchParams), [searchParams])

  const setParams = useCallback(
    (patch: Partial<CatalogParams>, options?: { replace?: boolean }) => {
      const next = { ...parseCatalogParams(searchParams), ...patch }
      setSearchParams(toSearchParams(next), { replace: options?.replace ?? false })
    },
    [searchParams, setSearchParams],
  )

  const clear = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return { params, setParams, clear }
}
