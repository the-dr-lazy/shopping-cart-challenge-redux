import React from 'react'

import * as Cart from '~/pages/cart'

import * as Data from '../data'
import { render, mkHandlers, mkState } from '../utils'

describe('Page.Cart.component', () => {
  const handlers = mkHandlers()

  describe('when products are loading', () => {
    it('should render loading message', () => {
      const state = mkState({
        products: { isLoading: true },
      })

      const { queryByText } = render(
        <Cart.component state={state} {...handlers} />
      )

      expect(queryByText(/loading/i)).not.toBeNull()
    })
  })

  describe('when cart is empty', () => {
    const state = mkState({
      cart: {},
    })

    it('should not render any product', () => {
      const { container } = render(
        <Cart.component state={state} {...handlers} />
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
          {...handlers}
        />
      )

      expect(getByLabelText(/remove all/i)).toBeDisabled()
    })
  })

  describe('when cart has product(s)', () => {
    const state = mkState({
      cart: { [Data.Product.a.id]: 3 },
      products: { isLoading: false, items: [Data.Product.a] },
    })

    it('should render products', () => {
      const { container } = render(
        <Cart.component state={state} {...handlers} />
      )

      const tbody = container.querySelector('tbody')!

      expect(tbody.childNodes.length).toBe(1)
    })

    it('should not disable remove all button', () => {
      const { getByLabelText } = render(
        <Cart.component state={state} {...handlers} />
      )

      expect(getByLabelText(/remove all/i)).toBeEnabled()
    })
  })
})
