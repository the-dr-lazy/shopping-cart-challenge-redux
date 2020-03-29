import {
  addProductToCart,
  removeProductFromCart,
  clearCart,
  reducer,
  getCartQuantity,
  getCartQuantitySum,
} from '~/store/cart'

import * as Data from '../data'
import { mkReducerTest } from '../utils'

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
  it('should return None when there is not any corresponding product in cart', () => {
    const state = { [Data.Product.b.id]: 1 }

    expect(getCartQuantity(Data.Product.a.id, state)).toBeNone()
  })

  it('should return Some(number) when cart contains the product', () => {
    const state = { [Data.Product.a.id]: 1, [Data.Product.b.id]: 7 }

    expect(getCartQuantity(Data.Product.b.id, state)).toBeSome(7)
  })
})

describe('Store.Cart.Selectors.getCartQuantitySum', () => {
  it('should return 0 for empty cart', () => {
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
