import type { CatalogLayout } from '../hooks/useCatalogLayout'

type ViewToggleProps = {
  layout: CatalogLayout
  onChange: (layout: CatalogLayout) => void
}

export function ViewToggle({ layout, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label="Product layout">
      <button
        type="button"
        aria-pressed={layout === 'grid'}
        aria-label="Grid view"
        onClick={() => onChange('grid')}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.2" />
          <rect x="11" y="2.5" width="6.5" height="6.5" rx="1.2" />
          <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.2" />
          <rect x="11" y="11" width="6.5" height="6.5" rx="1.2" />
        </svg>
      </button>
      <button
        type="button"
        aria-pressed={layout === 'row'}
        aria-label="Row view"
        onClick={() => onChange('row')}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="2.5" y="3" width="15" height="3.2" rx="1" />
          <rect x="2.5" y="8.4" width="15" height="3.2" rx="1" />
          <rect x="2.5" y="13.8" width="15" height="3.2" rx="1" />
        </svg>
      </button>
    </div>
  )
}
