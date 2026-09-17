import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import { API_BASE } from '../api/client'
import { mascara, outOfStockWatch, phone } from './fixtures'

const catalog = [mascara, phone, outOfStockWatch]

export const server = setupServer(
  http.get(`${API_BASE}/products/category-list`, () => {
    return HttpResponse.json(['smartphones', 'beauty', 'laptops'])
  }),
  http.get(`${API_BASE}/products/search`, ({ request }) => {
    const query = new URL(request.url).searchParams.get('q')?.toLowerCase() ?? ''
    const products = catalog.filter((product) => product.title.toLowerCase().includes(query))
    return HttpResponse.json({
      products,
      total: products.length,
      skip: 0,
      limit: 12,
    })
  }),
  http.get(`${API_BASE}/products/category/:category`, ({ params }) => {
    const products = catalog.filter((product) => product.category === params.category)
    return HttpResponse.json({
      products,
      total: products.length,
      skip: 0,
      limit: 12,
    })
  }),
  http.get(`${API_BASE}/products/:id`, ({ params }) => {
    const product = catalog.find((item) => item.id === Number(params.id))
    if (!product) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),
  http.get(`${API_BASE}/products`, () => {
    return HttpResponse.json({
      products: catalog,
      total: 194,
      skip: 0,
      limit: 12,
    })
  }),
  http.delete(`${API_BASE}/products/:id`, ({ params }) => {
    const product = catalog.find((item) => item.id === Number(params.id))
    if (!product) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 })
    }
    return HttpResponse.json({ ...product, isDeleted: true })
  }),
  http.patch(`${API_BASE}/products/:id`, async ({ params, request }) => {
    const product = catalog.find((item) => item.id === Number(params.id))
    if (!product) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 })
    }
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ ...product, ...body })
  }),
)

export { delay, http, HttpResponse }
