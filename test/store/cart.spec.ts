import { EMPTY, NEVER, of, throwError } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { observe } from 'rxjs-marbles/jest'

import {
  addProductToCart,
  removeProductFromCart,
  clearCart,
  reducer,
  getCartQuantity,
  getCartQuantitySum,
  persistCartEpic,
  rehydrateCart,
  rehydrateCartEpic,
} from '~/store/cart'

import * as Data from '../data'
import {
  mkReducerTest,
  mkEpicTest,
  mkTestState,
  mkTestEnvironment,
} from '../utils'

//
// Reducers
//

describe('Store.Cart.Reducer.reducer', () => {
  describe('when there was not any product has in the cart', () => {
    const state = {}
    it(
      'should handle add product to the cart',
      mkReducerTest(reducer, {
        state,
        action: addProductToCart(Data.Product.a.id),
        expected: { [Data.Product.a.id]: 1 },
      })
    )

    it(
      'should handle clear cart',
      mkReducerTest(reducer, {
        state,
        action: clearCart(),
        expected: {},
      })
    )
  })

  describe('when one product has been added to the cart', () => {
    const state = { [Data.Product.a.id]: 1 }

    it(
      "should handle add similar product to the cart by incrementing it's quantity",
      mkReducerTest(reducer, {
        state,
        action: addProductToCart(Data.Product.a.id),
        expected: { [Data.Product.a.id]: 2 },
      })
    )

    it(
      'should handle add another product to the cart',
      mkReducerTest(reducer, {
        state,
        action: addProductToCart(Data.Product.b.id),
        expected: { [Data.Product.a.id]: 1, [Data.Product.b.id]: 1 },
      })
    )

    it(
      'should handle remove similar product from the cart',
      mkReducerTest(reducer, {
        state,
        action: removeProductFromCart(Data.Product.a.id),
        expected: {},
      })
    )

    it(
      'should handle remove similar product from the cart absolutely',
      mkReducerTest(reducer, {
        state,
        action: removeProductFromCart(Data.Product.a.id, true),
        expected: {},
      })
    )

    it(
      'should handle clear cart',
      mkReducerTest(reducer, {
        state,
        action: clearCart(),
        expected: {},
      })
    )
  })

  describe('when one product has been added multiple times to the cart', () => {
    const state = { [Data.Product.a.id]: 3 }

    it(
      "should handle add similar product to the cart by incrementing it's quantity",
      mkReducerTest(reducer, {
        state,
        action: addProductToCart(Data.Product.a.id),
        expected: { [Data.Product.a.id]: 4 },
      })
    )

    it(
      'should handle add another product to the cart',
      mkReducerTest(reducer, {
        state,
        action: addProductToCart(Data.Product.b.id),
        expected: { [Data.Product.a.id]: 3, [Data.Product.b.id]: 1 },
      })
    )

    it(
      "should handle remove product from the cart by decrementing it's quantity",
      mkReducerTest(reducer, {
        state,
        action: removeProductFromCart(Data.Product.a.id),
        expected: { [Data.Product.a.id]: 2 },
      })
    )

    it(
      'should handle remove product from the cart absolutely',
      mkReducerTest(reducer, {
        state,
        action: removeProductFromCart(Data.Product.a.id, true),
        expected: {},
      })
    )

    it(
      'should handle clear cart',
      mkReducerTest(reducer, {
        state,
        action: clearCart(),
        expected: {},
      })
    )
  })

  describe('when there is many products in the cart', () => {
    const state = { [Data.Product.a.id]: 11, [Data.Product.b.id]: 6 }

    it(
      'should handle remove product from the cart absolutely',
      mkReducerTest(reducer, {
        state,
        action: removeProductFromCart(Data.Product.b.id, true),
        expected: { [Data.Product.a.id]: 11 },
      })
    )

    it(
      'should handle clear cart',
      mkReducerTest(reducer, {
        state,
        action: clearCart(),
        expected: {},
      })
    )
  })
})

//
// Selectors
//

describe('Store.Cart.Selector.getCartQuantity', () => {
  describe('isomorphic', () => {
    it('should return `0` when there is not any corresponding product in the cart', () => {
      const state = { [Data.Product.b.id]: 1 }

      expect(getCartQuantity(Data.Product.a.id, state, true)).toBe(0)
    })

    it('should return quantity of the product in the cart when cart contains the product', () => {
      const state = { [Data.Product.a.id]: 1, [Data.Product.b.id]: 7 }

      expect(getCartQuantity(Data.Product.b.id, state, true)).toBe(7)
    })
  })

  describe('non-isomorphic', () => {
    it('should return `None` when there is not any corresponding product in cart', () => {
      const state = { [Data.Product.b.id]: 1 }

      expect(getCartQuantity(Data.Product.a.id, state)).toBeNone()
    })

    it('should return `Some(number)` when cart contains the product', () => {
      const state = { [Data.Product.a.id]: 1, [Data.Product.b.id]: 7 }

      expect(getCartQuantity(Data.Product.b.id, state)).toBeSome(7)
    })
  })
})

describe('Store.Cart.Selector.getCartQuantitySum', () => {
  it('should return `0` for empty cart', () => {
    const state = {}

    expect(getCartQuantitySum(state)).toBe(0)
  })

  it('should return sum of the cart quantities', () => {
    const state = {
      [Data.Product.a.id]: 11,
      [Data.Product.b.id]: 6,
    }

    expect(getCartQuantitySum(state)).toBe(17)
  })
})

//
// Epics
//

describe('Store.Cart.Epic.persistCartEpic', () => {
  const environment = mkTestEnvironment({
    storage: {
      setCart: jest.fn().mockReturnValue(EMPTY),
    },
  })

  describe('when cart state changes', () => {
    it(
      'should not try to persist until rehydration completes',
      observe(() => {
        const a = { [Data.Product.a.id]: 1 }
        const state$ = of(a)

        const output$ = persistCartEpic(NEVER, state$, environment)

        function expectation() {
          expect(environment.storage.setCart).not.toBeCalled()
        }

        return output$.pipe(finalize(expectation))
      })
    )

    it(
      'should not stream out anything',
      mkEpicTest(persistCartEpic, environment, {
        marbles: {
          action: '  -r-----|',
          state: '   -a-b-c-|',
          expected: '-------|',
        },
        values: {
          action: {
            r: rehydrateCart.complete({}),
          },
          state: {
            a: {},
            b: { [Data.Product.a.id]: 1 },
            c: { [Data.Product.a.id]: 2 },
          },
        },
      })
    )

    it(
      'should try to persist cart state into storage',
      observe(() => {
        const a = { [Data.Product.a.id]: 1 }
        const b = { [Data.Product.a.id]: 2 }

        const action$ = of(rehydrateCart.complete(a))
        const state$ = of(a, b)

        const output$ = persistCartEpic(action$, state$, environment)

        function expectation() {
          expect(environment.storage.setCart).lastCalledWith(b)
        }

        return output$.pipe(finalize(expectation))
      })
    )

    it(
      'should not try to persist rehydration state',
      observe(() => {
        const a = { [Data.Product.a.id]: 1 }
        const b = { [Data.Product.a.id]: 1 }

        const action$ = of(rehydrateCart.complete(a))
        const state$ = of(a, b)

        const output$ = persistCartEpic(action$, state$, environment)

        function expectation() {
          expect(environment.storage.setCart).toBeCalledTimes(1)
        }

        return output$.pipe(finalize(expectation))
      })
    )

    it(
      'should persist just distinct states',
      observe(() => {
        const a = { [Data.Product.a.id]: 1 }
        const b = { [Data.Product.a.id]: 2 }

        const action$ = of(rehydrateCart.complete(a))
        const state$ = of(a, a, b, a)

        const output$ = persistCartEpic(action$, state$, environment)

        function expectation() {
          expect(environment.storage.setCart).toBeCalledTimes(2)
        }

        return output$.pipe(finalize(expectation))
      })
    )
  })
})

describe('Store.Cart.Epic.rehydrateCartEpic', () => {
  describe('when rehydrate request comes', () => {
    const environment = mkTestEnvironment({
      storage: {
        getCart: jest.fn().mockReturnValue(EMPTY),
      },
    })

    it(
      'should try to get cart state from the storage',
      observe(() => {
        const action$ = of(rehydrateCart.next())

        const output$ = rehydrateCartEpic(action$, NEVER, environment)

        function expectation() {
          expect(environment.storage.getCart).toBeCalled()
        }

        return output$.pipe(finalize(expectation))
      })
    )
  })

  describe('when storage responses with persisted cart state', () => {
    const environment = mkTestEnvironment({
      storage: {
        getCart: () => of({ [Data.Product.a.id]: 3 }),
      },
    })

    it(
      'should stream out rehydrate complete action',
      mkEpicTest(rehydrateCartEpic, environment, {
        marbles: {
          action: '  -n-|',
          expected: '-c-|',
        },
        values: {
          action: {
            n: rehydrateCart.next(),
          },
          expected: {
            c: rehydrateCart.complete({ [Data.Product.a.id]: 3 }),
          },
        },
      })
    )
  })

  describe('when storage responses with error', () => {
    const environment = mkTestEnvironment({
      storage: {
        getCart: () => throwError(new Error('!!!')),
      },
    })

    it(
      'should stream out rehydrate error action',
      mkEpicTest(rehydrateCartEpic, environment, {
        marbles: {
          action: '  -n-|',
          expected: '-e-|',
        },
        values: {
          action: {
            n: rehydrateCart.next(),
          },
          expected: {
            e: rehydrateCart.error(),
          },
        },
      })
    )
  })
})
