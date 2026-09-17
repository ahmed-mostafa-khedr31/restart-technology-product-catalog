import { getVisiblePages } from '../catalog/pagination'

type PaginationProps = {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 0) return null

  const items = getVisiblePages(page, pageCount)

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination__bar">
        <button
          type="button"
          className="pagination__nav"
          aria-label="Previous"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Previous</span>
        </button>

        <ul className="pagination__pages">
          {items.map((item, index) =>
            item === 'ellipsis' ? (
              <li key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  className={`pagination__page ${item === page ? 'is-current' : ''}`.trim()}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          className="pagination__nav"
          aria-label="Next"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          <span>Next</span>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
