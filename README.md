# Product Catalog

Take-home for Restart Technology: a production-style product catalog on [DummyJSON](https://dummyjson.com).

## Install and run

```bash
npm install
npm run dev
```

Open the printed local URL (Vite default is `http://localhost:5173`). The app redirects `/` to `/products`.

```bash
npm test
npm run build
```

No API keys or env files are required.

## Architecture

The catalog is a Vite + React + TypeScript SPA.

- `src/api` — DummyJSON client, product endpoints, and TypeScript types
- `src/catalog` — URL parsing and the local filters DummyJSON cannot do
- `src/hooks` — URL state, list/details queries, delete and update mutations
- `src/components` — presentational UI
- `src/pages/ProductsPage.tsx` — screen composition only

List operations that DummyJSON supports (pagination, search, category, sort) go to the server. The UI does not download the full dataset to filter in memory.

## Why TanStack Query

The hard parts of this task are async: overlapping search requests, keep-previous-data while filters change, details loading independently from the grid, and DELETE/PATCH mutations that must update the UI even though DummyJSON does not persist them.

TanStack Query fits that better than hand-rolled `useEffect` fetching or a global Redux store. Query keys model catalog state, `AbortSignal` drops stale in-flight requests when the key changes, and `placeholderData: keepPreviousData` keeps layout stable during refetches. There is no extra global store.

## URL synchronization

Catalog state is the URL:

`/products?q=phone&category=smartphones&stock=in&sort=price-desc&page=2`

- Search, category, stock, and sort changes reset `page` to 1 (omitted from the URL).
- Debounced search writes with **replace**, so typing does not fill history.
- Filter, sort, pagination, and Clear use **push**, so back/forward restores the previous view.
- Refresh and shared links rehydrate from `URLSearchParams`.

The details drawer is local UI state. Closing it does not touch catalog params.

## Stale requests

Search is debounced (300ms). Fetchers receive TanStack Query’s `AbortSignal`, so an older `/products/search` call is aborted when `q` changes. Responses from a previous query key cannot overwrite the current one.

## Known limitations (timebox)

- DummyJSON has no stock query param. Stock is applied to the current page only.
- Search and category cannot be combined in one DummyJSON request. If both are set, search runs on the server and category is applied to that page.
- DELETE/PATCH are simulated. Deleted ids and patched title/price overlays live in the query cache so a refetch does not restore DummyJSON’s original rows.
- Details are not stored in the URL.

## AI usage

I used AI (Cursor) for architecture feedback from the beginning, after the basic project structure was in place, and for MSW tests, and README drafting unless (AI usage) section.

I chose the stack (Vite over Next.js), URL replace-vs-push, TanStack Query, the local deleted-ids / updated-products overlays, and the DummyJSON fallbacks. I reviewed the code and can explain or change it in a live review.
