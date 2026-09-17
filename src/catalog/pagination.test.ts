import { describe, expect, it } from 'vitest'
import { getVisiblePages } from './pagination'

describe('getVisiblePages', () => {
  it('returns every page when the range is short', () => {
    expect(getVisiblePages(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('keeps first and last pages with ellipsis in the middle', () => {
    expect(getVisiblePages(8, 17)).toEqual([1, 'ellipsis', 7, 8, 9, 'ellipsis', 17])
  })

  it('shows a compact start window on the first pages', () => {
    expect(getVisiblePages(1, 17)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 17])
  })
})
