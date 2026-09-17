export type PageItem = number | 'ellipsis'

export function getVisiblePages(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 0) return []
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const current = Math.min(Math.max(page, 1), pageCount)
  const pages = new Set<number>([1, pageCount, current])

  if (current <= 4) {
    for (let number = 2; number <= 5; number += 1) pages.add(number)
  } else if (current >= pageCount - 3) {
    for (let number = pageCount - 4; number < pageCount; number += 1) pages.add(number)
  } else {
    pages.add(current - 1)
    pages.add(current + 1)
  }

  const sorted = [...pages].filter((number) => number >= 1 && number <= pageCount).sort((a, b) => a - b)
  const items: PageItem[] = []

  for (const number of sorted) {
    const previous = items[items.length - 1]
    if (typeof previous === 'number' && number - previous > 1) items.push('ellipsis')
    items.push(number)
  }

  return items
}
