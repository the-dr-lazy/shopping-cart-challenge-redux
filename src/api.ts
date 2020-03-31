import { of } from 'rxjs'
import { delay } from 'rxjs/operators'

import { Product } from '~/store'

const mockProducts: Product[] = [
  {
    id: '10001',
    name: 'Product A',
    price: 1000,
    image: 'https://via.placeholder.com/150/771796',
  },
  {
    id: '10002',
    name: 'Product B',
    price: 2000,
    image: 'https://via.placeholder.com/150/771734',
  },
  {
    id: '10003',
    name: 'Product C',
    price: 3000,
    image: 'https://via.placeholder.com/150/92c952',
  },
  {
    id: '10004',
    name: 'Product D',
    price: 4000,
    image: 'https://via.placeholder.com/150/b0f7cc',
  },
  {
    id: '10005',
    name: 'Product E',
    price: 5000,
    image: 'https://via.placeholder.com/150/51aa97',
  },
]

export function fetchProducts() {
  return of(mockProducts).pipe(delay(100))
}
