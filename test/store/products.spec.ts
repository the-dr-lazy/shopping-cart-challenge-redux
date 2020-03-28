import { of, throwError } from 'rxjs'

import {
  fetchProducts,
  isLoadingReducer,
  itemsReducer,
  fetchProductsEpic,
} from '~/store/products'

import * as Data from '../data'
import { createReducerTest, createEpicTest, createEnvironment } from '../utils'

describe('Store.Products', () => {
  describe('reducers', () => {
    describe('isLoadingReducer', () => {
      it(
        'should handle fetch next',
        createReducerTest(isLoadingReducer, {
          state: false,
          action: fetchProducts.next(),
          expected: true,
        })
      )
      it(
        'should handle fetch error',
        createReducerTest(isLoadingReducer, {
          state: true,
          action: fetchProducts.error(),
          expected: false,
        })
      )
      it(
        'should handle fetch complete',
        createReducerTest(isLoadingReducer, {
          state: true,
          action: fetchProducts.complete([Data.Product.a]),
          expected: false,
        })
      )
    })

    describe('itemsReducer', () => {
      describe('when there is no products', () => {
        it(
          'should handle fetch complete',
          createReducerTest(itemsReducer, {
            state: [],
            action: fetchProducts.complete([Data.Product.a]),
            expected: [Data.Product.a],
          })
        )
      })

      describe('when there is any products', () => {
        it(
          'should handle fetch complete',
          createReducerTest(itemsReducer, {
            state: [Data.Product.a],
            action: fetchProducts.complete([Data.Product.b]),
            expected: [Data.Product.b],
          })
        )
      })
    })
  })

  describe('epics', () => {
    describe('fetchProductsEpic', () => {
      describe('when API responses with products', () => {
        const environment = createEnvironment({
          API: {
            fetchProducts: of([Data.Product.a]),
          },
        })

        it(
          'should output fetch complete',
          createEpicTest(fetchProductsEpic, environment, {
            marbles: {
              action: '  -n-',
              expected: '-c-',
            },
            values: {
              action: {
                n: fetchProducts.next(),
              },
              expected: {
                c: fetchProducts.complete([Data.Product.a]),
              },
            },
          })
        )
      })

      describe('when API responses with error', () => {
        const environment = createEnvironment({
          API: {
            fetchProducts: throwError('!'),
          },
        })

        it(
          'should output fetch error',
          createEpicTest(fetchProductsEpic, environment, {
            marbles: {
              action: '  -n-',
              expected: '-e-',
            },
            values: {
              action: {
                n: fetchProducts.next(),
              },
              expected: {
                e: fetchProducts.error(),
              },
            },
          })
        )
      })
    })
  })
})
