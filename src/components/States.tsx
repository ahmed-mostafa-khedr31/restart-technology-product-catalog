export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="panel-state" role="status">
      <h2>{title}</h2>
      <p>{detail}</p>
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  detail = 'The catalog could not be loaded. Check your connection and try again.',
  onRetry,
}: {
  title?: string
  detail?: string
  onRetry: () => void
}) {
  return (
    <div className="panel-state" role="alert">
      <h2>{title}</h2>
      <p>{detail}</p>
      <button type="button" className="button button--primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export function ProductGridSkeleton({ layout = 'grid' }: { layout?: 'grid' | 'row' }) {
  return (
    <ul className={`product-grid product-grid--${layout}`} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <li key={index} className={`product-card product-card--${layout} product-card--skeleton`}>
          <div className="product-card__media">
            <div className="product-image skeleton" />
          </div>
          <div className="product-card__body">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line--short" />
          </div>
        </li>
      ))}
    </ul>
  )
}
