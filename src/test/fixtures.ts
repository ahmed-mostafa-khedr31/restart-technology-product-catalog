import type { Product } from '../api/types'

export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Essence Mascara',
    description: 'Volumizing mascara',
    category: 'beauty',
    price: 9.99,
    rating: 4.5,
    stock: 12,
    brand: 'Essence',
    thumbnail: 'https://cdn.dummyjson.com/thumb.png',
    images: ['https://cdn.dummyjson.com/thumb.png'],
    ...overrides,
  }
}

export const mascara = createProduct()
export const phone = createProduct({
  id: 2,
  title: 'iPhone 15',
  description: 'A smartphone',
  category: 'smartphones',
  price: 999,
  rating: 4.8,
  stock: 4,
  brand: 'Apple',
})
export const outOfStockWatch = createProduct({
  id: 3,
  title: 'Classic Watch',
  description: 'A watch with no remaining stock',
  category: 'mens-watches',
  price: 120,
  rating: 4.1,
  stock: 0,
  brand: 'Rolex',
})
