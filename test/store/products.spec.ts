import { of, throwError, EMPTY, NEVER } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { observe } from 'rxjs-marbles/jest'

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
import { mkReducerTest, mkEpicTest, mkTestEnvironment } from '../utils'

//
// Reducers
//

describe('Store.Products.Reducer.isLoadingReducer', () => {
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

describe('Store.Products.Reducer.itemsReducer', () => {
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

//
// Selectors
//

describe('Store.Products.Selector.getIsProductsLoading', () => {
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

describe('Store.Products.Selector.getProduct', () => {
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

describe('Store.Products.Selector.getProducts', () => {
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

//
// Epics
//

describe('Store.Products.Epic.fetchProductsEpic', () => {
  describe('when fetch products request comes', () => {
    const environment = mkTestEnvironment({
      API: {
        fetchProducts: jest.fn().mockReturnValue(EMPTY),
      },
    })

    it(
      'should try to fetch products from API',
      observe(() => {
        const action$ = of(fetchProducts.next())

        const output$ = fetchProductsEpic(action$, NEVER, environment)

        function expectation() {
          expect(environment.API.fetchProducts).toBeCalled()
        }

        return output$.pipe(finalize(expectation))
      })
    )
  })

  describe('when API responses with products', () => {
    const environment = mkTestEnvironment({
      API: {
        fetchProducts: () => of([Data.Product.a]),
      },
    })

    it(
      'should output fetch complete',
      mkEpicTest(fetchProductsEpic, environment, {
        marbles: {
          action: '  -n-|',
          expected: '-c-|',
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
    const environment = mkTestEnvironment({
      API: {
        fetchProducts: () => throwError('!'),
      },
    })

    it(
      'should output fetch error',
      mkEpicTest(fetchProductsEpic, environment, {
        marbles: {
          action: '  -n-|',
          expected: '-e-|',
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
