import type { SortKey, StockFilter } from '../api/types'
import { formatCategoryLabel, formatProductCount } from '../catalog/params'
import type { CatalogLayout } from '../hooks/useCatalogLayout'
import { CatalogTitle } from './CatalogTitle'
import { ViewToggle } from './ViewToggle'

type CatalogFiltersProps = {
  searchValue: string
  category: string
  stock: StockFilter
  sort: SortKey
  categories: string[]
  categoriesLoading: boolean
  total: number | null
  layout: CatalogLayout
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStockChange: (value: StockFilter) => void
  onSortChange: (value: SortKey) => void
  onLayoutChange: (layout: CatalogLayout) => void
  onClear: () => void
}

export function CatalogFilters({
  searchValue,
  category,
  stock,
  sort,
  categories,
  categoriesLoading,
  total,
  layout,
  onSearchChange,
  onCategoryChange,
  onStockChange,
  onSortChange,
  onLayoutChange,
  onClear,
}: CatalogFiltersProps) {
  const isFiltered = Boolean(searchValue || category || stock !== 'all' || sort !== 'relevance')

  return (
    <div className="catalog-toolbar">
      <header className="catalog-header">
        <CatalogTitle />

        <div className="catalog-header__search">
          <label className="filter-control filter-control--search">
            <span className="visually-hidden">Search</span>
            <span className="search-field">
              <svg className="search-field__icon" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12.4 12.4 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={searchValue}
                placeholder="Search products..."
                aria-label="Search products"
                onChange={(event) => onSearchChange(event.target.value)}
                autoComplete="off"
              />
            </span>
          </label>

          <p className="catalog-header__count" aria-live="polite">
            {total === null ? 'Loading' : formatProductCount(total)}
          </p>
        </div>
      </header>

      <div className="catalog-filters">
        <label className={`filter-chip ${category ? 'is-active' : ''}`.trim()}>
          <span className="filter-chip__icon">
            <FolderIcon />
          </span>
          <span className="filter-chip__label">Category</span>
          <span className="filter-chip__field">
            <select
              value={category}
              disabled={categoriesLoading}
              aria-label="Category"
              onChange={(event) => onCategoryChange(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {formatCategoryLabel(item)}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </span>
        </label>

        <label className={`filter-chip ${stock !== 'all' ? 'is-active' : ''}`.trim()}>
          <span className="filter-chip__icon">
            <BoxIcon />
          </span>
          <span className="filter-chip__label">Stock</span>
          <span className="filter-chip__field">
            <select
              value={stock}
              aria-label="Stock"
              onChange={(event) => onStockChange(event.target.value as StockFilter)}
            >
              <option value="all">All</option>
              <option value="in">In stock</option>
              <option value="out">Out of stock</option>
            </select>
            <ChevronIcon />
          </span>
        </label>

        <label className={`filter-chip ${sort !== 'relevance' ? 'is-active' : ''}`.trim()}>
          <span className="filter-chip__icon">
            <SortIcon />
          </span>
          <span className="filter-chip__label">Sort</span>
          <span className="filter-chip__field">
            <select
              value={sort}
              aria-label="Sort"
              onChange={(event) => onSortChange(event.target.value as SortKey)}
            >
              <option value="relevance">Relevance</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
              <option value="price-asc">Price low–high</option>
              <option value="price-desc">Price high–low</option>
              <option value="rating-desc">Rating high–low</option>
            </select>
            <ChevronIcon />
          </span>
        </label>

        <button
          type="button"
          className={`catalog-filters__clear ${isFiltered ? 'is-active' : ''}`.trim()}
          onClick={onClear}
        >
          <span className="catalog-filters__clear-icon">
            <ClearIcon />
          </span>
          Clear
        </button>

        <div className="catalog-filters__meta">
          <ViewToggle layout={layout} onChange={onLayoutChange} />
        </div>
      </div>
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg className="filter-chip__chevron" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2.2 4.2 6 8l3.8-3.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M5.2 5.2 14.8 14.8M14.8 5.2 5.2 14.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M3.2 5.2h4.2l1.3 1.6h8.1v8.2H3.2V5.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M3.4 6.2 10 3.4l6.6 2.8v7.6L10 16.6 3.4 13.8V6.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 16.6V9.4M3.4 6.2 10 9.4l6.6-3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 4.5v11M6 4.5 3.8 6.8M6 4.5 8.2 6.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 15.5V4.5M14 15.5 11.8 13.2M14 15.5 16.2 13.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
