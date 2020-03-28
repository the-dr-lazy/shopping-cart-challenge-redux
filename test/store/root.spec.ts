import { getCartTotalPrice, getCartEntries, State } from '~/store/root'

import * as Data from '../data'

describe('Store.Root', () => {
  describe('selectors', () => {
    describe('getCartEntries', () => {
      it('should return empty array for empty cart', () => {
        const state: State = {
          cart: {},
          products: { isLoading: false, items: [Data.Product.a] },
        }

        expect(getCartEntries(state)).toEqual([])
      })

      it('should return cart entry for non-empty cart', () => {
        const state: State = {
          cart: { [Data.Product.a.id]: 2, [Data.Product.b.id]: 5 },
          products: {
            isLoading: false,
            items: [Data.Product.a, Data.Product.b],
          },
        }
        const expected = [
          [Data.Product.a, 2],
          [Data.Product.b, 5],
        ]

        expect(getCartEntries(state)).toEqual(expected)
      })
    })

    describe('getCartTotalPrice', () => {
      it('should return zero for empty cart', () => {
        const state: State = {
          cart: {},
          products: { isLoading: false, items: [Data.Product.a] },
        }

        expect(getCartTotalPrice(state)).toBe(0)
      })

      it('should calculate total price of non-empty cart', () => {
        const state: State = {
          cart: { [Data.Product.a.id]: 2, [Data.Product.b.id]: 5 },
          products: {
            isLoading: false,
            items: [Data.Product.a, Data.Product.b],
          },
        }
        const expected = Data.Product.a.price * 2 + Data.Product.b.price * 5

        expect(getCartTotalPrice(state)).toBe(expected)
      })
    })
  })
})
