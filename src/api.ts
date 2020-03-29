import { of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { Product } from '~/store'

const mockProducts: Product[] = [
  {
    name: 'Product A',
    price: 1000,
    id: 10001,
    image: 'https://via.placeholder.com/150/771796',
  },
  {
    name: 'Product B',
    price: 2000,
    id: 10002,
    image: 'https://via.placeholder.com/150/771734',
  },
  {
    name: 'Product C',
    price: 3000,
    id: 10003,
    image: 'https://via.placeholder.com/150/92c952',
  },
  {
    name: 'Product D',
    price: 4000,
    id: 10004,
    image: 'https://via.placeholder.com/150/b0f7cc',
  },
  {
    name: 'Product E',
    price: 5000,
    id: 10005,
    image: 'https://via.placeholder.com/150/51aa97',
  },
]

export const fetchProducts = of(mockProducts).pipe(delay(100))
