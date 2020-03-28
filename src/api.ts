import { of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { Product } from '~/store'

export const fetchProducts = of(<Product[]>[]).pipe(delay(100))
