import { describe, expect, it } from 'vitest'
import type { CatalogParams } from '../api/types'
import { createProduct } from '../test/fixtures'
import { applyLocalFilters, matchesSearchQuery, paginateProducts } from './filters'

function params(overrides: Partial<CatalogParams> = {}): CatalogParams {
  return {
    q: '',
    category: '',
    stock: 'all',
    sort: 'relevance',
    page: 1,
    ...overrides,
  }
}

const phone = createProduct({
  id: 2,
  title: 'iPhone 15',
  description: 'A smartphone',
  category: 'smartphones',
  brand: 'Apple',
})
const mascara = createProduct({
  id: 1,
  title: 'Essence Mascara',
  description: 'Volumizing mascara',
  category: 'beauty',
  brand: 'Essence',
})
const watch = createProduct({
  id: 3,
  title: 'Classic Watch',
  description: 'A watch with no remaining stock',
  category: 'mens-watches',
  brand: 'Rolex',
  stock: 0,
})

describe('matchesSearchQuery', () => {
  it('matches a short prefix inside the title case-insensitively', () => {
    expect(matchesSearchQuery(phone, 'ph')).toBe(true)
    expect(matchesSearchQuery(phone, 'PHONE')).toBe(true)
    expect(matchesSearchQuery(mascara, 'ph')).toBe(false)
    expect(matchesSearchQuery(createProduct({ title: 'Table Lamp', description: 'sophistication' }), 'ph')).toBe(
      false,
    )
  })
})

describe('applyLocalFilters', () => {
  it('keeps phone products for "ph" and drops unrelated titles', () => {
    const result = applyLocalFilters([mascara, phone, watch], params({ q: 'ph' }), [])
    expect(result.map((product) => product.title)).toEqual(['iPhone 15'])
  })

  it('still applies stock, category, and deleted overlays while searching', () => {
    const result = applyLocalFilters(
      [mascara, phone, watch],
      params({ q: 'ph', category: 'smartphones', stock: 'in' }),
      [phone.id],
    )
    expect(result).toEqual([])
  })
})

describe('paginateProducts', () => {
  it('slices the filtered list for the current page', () => {
    const items = Array.from({ length: 5 }, (_, index) => createProduct({ id: index + 1, title: `Item ${index + 1}` }))
    expect(paginateProducts(items, 2, 2).map((product) => product.id)).toEqual([3, 4])
  })
})
