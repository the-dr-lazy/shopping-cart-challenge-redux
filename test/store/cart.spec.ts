import {
  addProductToCart,
  removeProductFromCart,
  clearCart,
  reducer,
  getCartQuantitySum,
} from '~/store/cart'

import * as Data from '../data'
import { createReducerTest } from '../utils'

describe('Store.Cart', () => {
  describe('reducer', () => {
    describe('when there was not any product has in the cart', () => {
      const state = {}
      it(
        'should handle add product to the cart',
        createReducerTest(reducer, {
          state,
          action: addProductToCart(Data.Product.a.id),
          expected: { [Data.Product.a.id]: 1 },
        })
      )

      it(
        'should handle clear cart',
        createReducerTest(reducer, {
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
        createReducerTest(reducer, {
          state,
          action: addProductToCart(Data.Product.a.id),
          expected: { [Data.Product.a.id]: 2 },
        })
      )

      it(
        'should handle add another product to the cart',
        createReducerTest(reducer, {
          state,
          action: addProductToCart(Data.Product.b.id),
          expected: { [Data.Product.a.id]: 1, [Data.Product.b.id]: 1 },
        })
      )

      it(
        'should handle remove similar product from the cart',
        createReducerTest(reducer, {
          state,
          action: removeProductFromCart(Data.Product.a.id),
          expected: {},
        })
      )

      it(
        'should handle remove similar product from the cart absolutely',
        createReducerTest(reducer, {
          state,
          action: removeProductFromCart(Data.Product.a.id, true),
          expected: {},
        })
      )

      it(
        'should handle clear cart',
        createReducerTest(reducer, {
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
        createReducerTest(reducer, {
          state,
          action: addProductToCart(Data.Product.a.id),
          expected: { [Data.Product.a.id]: 4 },
        })
      )

      it(
        'should handle add another product to the cart',
        createReducerTest(reducer, {
          state,
          action: addProductToCart(Data.Product.b.id),
          expected: { [Data.Product.a.id]: 3, [Data.Product.b.id]: 1 },
        })
      )

      it(
        "should handle remove product from the cart by decrementing it's quantity",
        createReducerTest(reducer, {
          state,
          action: removeProductFromCart(Data.Product.a.id),
          expected: { [Data.Product.a.id]: 2 },
        })
      )

      it(
        'should handle remove product from the cart absolutely',
        createReducerTest(reducer, {
          state,
          action: removeProductFromCart(Data.Product.a.id, true),
          expected: {},
        })
      )

      it(
        'should handle clear cart',
        createReducerTest(reducer, {
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
        createReducerTest(reducer, {
          state,
          action: removeProductFromCart(Data.Product.b.id, true),
          expected: { [Data.Product.a.id]: 11 },
        })
      )

      it(
        'should handle clear cart',
        createReducerTest(reducer, {
          state,
          action: clearCart(),
          expected: {},
        })
      )
    })
  })

  describe('selectors', () => {
    describe('getCartQuantitySum', () => {
      it('should return 0 for empty cart', () => {
        expect(getCartQuantitySum({})).toBe(0)
      })

      it('should return sum of the cart quantities', () => {
        expect(
          getCartQuantitySum({
            [Data.Product.a.id]: 11,
            [Data.Product.b.id]: 6,
          })
        ).toBe(17)
      })
    })
  })
})
