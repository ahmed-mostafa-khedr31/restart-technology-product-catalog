import { useEffect, useState } from 'react'

export type CatalogLayout = 'grid' | 'row'

const STORAGE_KEY = 'catalog-layout'

function readStoredLayout(): CatalogLayout {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'row' ? 'row' : 'grid'
  } catch {
    return 'grid'
  }
}

export function useCatalogLayout() {
  const [layout, setLayout] = useState<CatalogLayout>(readStoredLayout)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, layout)
    } catch {
      // Ignore private-mode / blocked storage.
    }
  }, [layout])

  return [layout, setLayout] as const
}
