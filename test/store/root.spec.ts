import {
  mkCartEntity,
  getCartEntity,
  getCartEntities,
  getCartTotalPrice,
} from '~/store/root'

import * as Data from '../data'
import { mkTestState } from '../utils'

//
// Data Types
//

describe('Store.Root.Data', () => {
  describe('mkCartEntity', () => {
    it('should be curried', () => {
      expect(mkCartEntity(Data.Product.a)).toBeInstanceOf(Function)
    })

    it('should return correct CartEntity', () => {
      const expected = {
        quantity: 3,
        ...Data.Product.a,
      }

      expect(mkCartEntity(Data.Product.a)(3)).toEqual(expected)
    })
  })
})

//
// Selectors
//

describe('Store.Root.Selector.getCartTotalPrice', () => {
  it('should return zero for empty cart', () => {
    const state = mkTestState({
      cart: {},
      products: { items: [Data.Product.a] },
    })

    expect(getCartTotalPrice(state)).toBe(0)
  })

  it('should calculate total price of non-empty cart', () => {
    const state = mkTestState({
      cart: { [Data.Product.a.id]: 2, [Data.Product.b.id]: 5 },
      products: {
        items: [Data.Product.a, Data.Product.b],
      },
    })
    const expected = Data.Product.a.price * 2 + Data.Product.b.price * 5

    expect(getCartTotalPrice(state)).toBe(expected)
  })
})

describe('Store.Root.Selector.getCartEntity', () => {
  it('should return None when there is not any corresponding product in the cart', () => {
    const state = mkTestState({
      cart: {},
      products: { items: [Data.Product.a] },
    })

    expect(getCartEntity(Data.Product.b.id, state)).toBeNone()
  })

  it('should return Some(CartEntity) when the product exists in the cart', () => {
    const state = mkTestState({
      cart: { [Data.Product.a.id]: 3 },
      products: { items: [Data.Product.a, Data.Product.b] },
    })
    const expectedValue = { ...Data.Product.a, quantity: 3 }

    expect(getCartEntity(Data.Product.a.id, state)).toBeSome(expectedValue)
  })
})

describe('Store.Root.Selectors.getCartEntities', () => {
  it('should return empty array for empty cart', () => {
    const state = mkTestState({
      cart: {},
      products: { items: [Data.Product.a] },
    })

    expect(getCartEntities(state)).toEqual([])
  })

  it('should return cart entities for non-empty cart', () => {
    const state = mkTestState({
      cart: {
        [Data.Product.a.id]: 2,
        [Data.Product.b.id]: 5,
      },
      products: {
        items: [Data.Product.a, Data.Product.b],
      },
    })
    const expected = [
      { ...Data.Product.a, quantity: 2 },
      { ...Data.Product.b, quantity: 5 },
    ]

    expect(getCartEntities(state)).toEqual(expected)
  })
})
