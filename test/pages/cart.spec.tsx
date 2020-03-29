import React from 'react'

import * as Cart from '~/pages/cart'

import * as Data from '../data'
import { render } from '../utils'

describe('<Cart.component />', () => {
  describe('when products are loading', () => {
    it('should render loading message', () => {
      const { queryByText } = render(
        <Cart.component
          state={{
            cart: {},
            products: { isLoading: true, items: [] },
          }}
        />
      )

      expect(queryByText(/loading/i)).not.toBeNull()
    })
  })

  describe('when cart is empty', () => {
    it('should not render any product', () => {
      const { container } = render(
        <Cart.component
          state={{
            cart: {},
            products: { isLoading: false, items: [] },
          }}
        />
      )

      const tbody = container.querySelector('tbody')!

      expect(tbody.childNodes.length).toBe(0)
    })

    it('should disable remove all button', () => {
      const { getByLabelText } = render(
        <Cart.component
          state={{
            cart: {},
            products: { isLoading: false, items: [] },
          }}
        />
      )

      expect(getByLabelText(/remove all/i)).toBeDisabled()
    })
  })

  describe('when cart has product(s)', () => {
    it('should render products', () => {
      const { container } = render(
        <Cart.component
          state={{
            cart: { [Data.Product.a.id]: 3 },
            products: { isLoading: false, items: [Data.Product.a] },
          }}
        />
      )

      const tbody = container.querySelector('tbody')!

      expect(tbody.childNodes.length).toBe(1)
    })

    it('should not disable remove all button', () => {
      const { getByLabelText } = render(
        <Cart.component
          state={{
            cart: { [Data.Product.a.id]: 3 },
            products: { isLoading: false, items: [Data.Product.a] },
          }}
        />
      )

      expect(getByLabelText(/remove all/i)).toBeEnabled()
    })
  })
})
