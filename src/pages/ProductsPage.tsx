import { useEffect, useState } from 'react'
import { PAGE_SIZE } from '../api/client'
import type { Product, SortKey, StockFilter } from '../api/types'
import { CatalogFilters } from '../components/CatalogFilters'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Pagination } from '../components/Pagination'
import { ProductDetailsDrawer } from '../components/ProductDetailsDrawer'
import { ProductGrid } from '../components/ProductGrid'
import { EmptyState, ErrorState, ProductGridSkeleton } from '../components/States'
import { useCatalogLayout } from '../hooks/useCatalogLayout'
import { useCatalogParams } from '../hooks/useCatalogParams'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useDeleteProduct } from '../hooks/useDeleteProduct'
import { useCategories, useProductList } from '../hooks/useProductList'

export function ProductsPage() {
  const { params, setParams, clear } = useCatalogParams()
  const [searchInput, setSearchInput] = useState(params.q)
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [layout, setLayout] = useCatalogLayout()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const list = useProductList(params)
  const categories = useCategories()
  const deleteMutation = useDeleteProduct()

  useEffect(() => {
    setSearchInput(params.q)
  }, [params.q])

  useEffect(() => {
    if (debouncedSearch !== searchInput) return
    if (debouncedSearch === params.q) return
    setParams({ q: debouncedSearch, page: 1 }, { replace: true }) // replace: typing should not spam history
  }, [debouncedSearch, params.q, searchInput, setParams])

  const pageCount = Math.max(1, Math.ceil(list.total / PAGE_SIZE))

  async function confirmDelete() {
    if (!pendingDelete) return
    const deleted = pendingDelete
    try {
      await deleteMutation.mutateAsync(deleted.id)
      setPendingDelete(null)
      if (selectedId === deleted.id) setSelectedId(null)
      const remainingOnPage = list.products.filter((product) => product.id !== deleted.id)
      if (remainingOnPage.length === 0 && params.page > 1) {
        setParams({ page: params.page - 1 })
      }
    } catch {
      // Toast is shown by the mutation; keep the product visible.
    }
  }

  return (
    <div className="app-shell">
      <CatalogFilters
        searchValue={searchInput}
        category={params.category}
        stock={params.stock}
        sort={params.sort}
        categories={categories.data ?? []}
        categoriesLoading={categories.isLoading}
        total={list.hasLoadedData ? list.total : null}
        layout={layout}
        onSearchChange={setSearchInput}
        onCategoryChange={(category) => setParams({ category, page: 1 })}
        onStockChange={(stock: StockFilter) => setParams({ stock, page: 1 })}
        onSortChange={(sort: SortKey) => setParams({ sort, page: 1 })}
        onLayoutChange={setLayout}
        onClear={() => {
          setSearchInput('')
          clear()
        }}
      />

      {list.isLoading && !list.hasLoadedData ? <ProductGridSkeleton layout={layout} /> : null}

      {list.isError && !list.hasLoadedData ? (
        <ErrorState
          onRetry={() => {
            void list.refetch()
          }}
        />
      ) : null}

      {list.hasLoadedData && list.products.length === 0 && !list.isFetching ? (
        <EmptyState
          title="No products found"
          detail="Try a different search term or clear the current filters."
        />
      ) : null}

      {list.hasLoadedData && list.products.length > 0 ? (
        <ProductGrid
          products={list.products}
          layout={layout}
          pending={list.isFetching}
          onOpen={setSelectedId}
          onDelete={setPendingDelete}
        />
      ) : null}

      {list.hasLoadedData && list.total > 0 ? (
        <Pagination
          page={params.page}
          pageCount={pageCount}
          onPageChange={(page) => setParams({ page })}
        />
      ) : null}

      {selectedId !== null ? (
        <ProductDetailsDrawer productId={selectedId} onClose={() => setSelectedId(null)} />
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          product={pendingDelete}
          pending={deleteMutation.isPending}
          onConfirm={() => {
            void confirmDelete()
          }}
          onCancel={() => {
            if (!deleteMutation.isPending) setPendingDelete(null)
          }}
        />
      ) : null}
    </div>
  )
}
