import { of, throwError } from 'rxjs'

import {
  fetchProducts,
  isLoadingReducer,
  itemsReducer,
  fetchProductsEpic,
  getProducts,
  getProduct,
  getIsProductsLoading,
} from '~/store/products'

import * as Data from '../data'
import { mkReducerTest, mkEpicTest, mkEnvironment } from '../utils'

describe('Store.Products', () => {
  describe('reducers', () => {
    describe('isLoadingReducer', () => {
      it(
        'should handle fetch next',
        mkReducerTest(isLoadingReducer, {
          state: false,
          action: fetchProducts.next(),
          expected: true,
        })
      )
      it(
        'should handle fetch error',
        mkReducerTest(isLoadingReducer, {
          state: true,
          action: fetchProducts.error(),
          expected: false,
        })
      )
      it(
        'should handle fetch complete',
        mkReducerTest(isLoadingReducer, {
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
          mkReducerTest(itemsReducer, {
            state: [],
            action: fetchProducts.complete([Data.Product.a]),
            expected: [Data.Product.a],
          })
        )
      })

      describe('when there is any products', () => {
        it(
          'should handle fetch complete',
          mkReducerTest(itemsReducer, {
            state: [Data.Product.a],
            action: fetchProducts.complete([Data.Product.b]),
            expected: [Data.Product.b],
          })
        )
      })
    })
  })

  describe('selectors', () => {
    describe('getProducts', () => {
      describe('when there is not any product', () => {
        it('should return empty array', () => {
          const state = {
            isLoading: false,
            items: [],
          }

          expect(getProducts(state)).toEqual([])
        })
      })

      describe('when there is any products', () => {
        it('should return items', () => {
          const state = {
            isLoading: false,
            items: [Data.Product.a],
          }

          expect(getProducts(state)).toEqual([Data.Product.a])
        })
      })
    })

    describe('getProduct', () => {
      describe('when there is not any matching product', () => {
        it('should return none', () => {
          const state = {
            isLoading: false,
            items: [Data.Product.a],
          }

          expect(getProduct(Data.Product.b.id, state)).toBeNone()
        })
      })

      describe('when there is a matching product', () => {
        const state = {
          isLoading: false,
          items: [Data.Product.a],
        }

        expect(getProduct(Data.Product.a.id, state)).toBeSome(Data.Product.a)
      })
    })
  })

  describe('selectors', () => {
    describe('getIsProductsLoading', () => {
      it('should return false when products are not loading', () => {
        const state = {
          isLoading: false,
          items: [],
        }

        expect(getIsProductsLoading(state)).toBe(false)
      })

      it('should return true when products are loading', () => {
        const state = {
          isLoading: true,
          items: [],
        }

        expect(getIsProductsLoading(state)).toBe(true)
      })
    })

    describe('getProduct', () => {
      it('should return None when there is not any corresponding product', () => {
        const state = {
          isLoading: false,
          items: [Data.Product.a],
        }

        expect(getProduct(Data.Product.b.id, state)).toBeNone()
      })

      it('should return Some(product) when product exists', () => {
        const state = {
          isLoading: false,
          items: [Data.Product.a, Data.Product.b],
        }

        expect(getProduct(Data.Product.a.id, state)).toBeSome(Data.Product.a)
      })
    })

    describe('getProducts', () => {
      it('should return empty array when there is not any product', () => {
        const state = {
          isLoading: false,
          items: [],
        }

        expect(getProducts(state)).toEqual([])
      })

      it('should return products when there is any', () => {
        const state = {
          isLoading: false,
          items: [Data.Product.a, Data.Product.b],
        }

        expect(getProducts(state)).toEqual([Data.Product.a, Data.Product.b])
      })
    })
  })

  describe('epics', () => {
    describe('fetchProductsEpic', () => {
      describe('when API responses with products', () => {
        const environment = mkEnvironment({
          API: {
            fetchProducts: of([Data.Product.a]),
          },
        })

        it(
          'should output fetch complete',
          mkEpicTest(fetchProductsEpic, environment, {
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
        const environment = mkEnvironment({
          API: {
            fetchProducts: throwError('!'),
          },
        })

        it(
          'should output fetch error',
          mkEpicTest(fetchProductsEpic, environment, {
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
