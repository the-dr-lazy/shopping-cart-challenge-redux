import React from 'react'

import * as Handlers from '~/Handlers'
import * as Cart from '~/Page/Cart'

import * as Data from '~/Test/Data'
import { render, mkTestHandlers, mkTestState } from '~/Test/Utils'

describe('Page.Cart.component', () => {
  const handlers = mkTestHandlers()

  describe('when products are loading', () => {
    it('should render loading message', () => {
      const state = mkTestState({
        products: { isLoading: true },
      })

      const { queryByText } = render(
        <Handlers.provider value={handlers}>
          <Cart.component state={state} />
        </Handlers.provider>
      )

      expect(queryByText(/loading/i)).not.toBeNull()
    })
  })

  describe('when cart is empty', () => {
    const state = mkTestState({
      cart: {},
    })

    it('should disable remove all button', () => {
      const { getByLabelText } = render(
        <Handlers.provider value={handlers}>
          <Cart.component state={state} />
        </Handlers.provider>
      )

      expect(getByLabelText(/remove all/i)).toBeDisabled()
    })

    it('should render total price', () => {
      const { getByTestId } = render(
        <Handlers.provider value={handlers}>
          <Cart.component state={state} />
        </Handlers.provider>
      )

      expect(getByTestId('total-price')).toHaveTextContent('$0')
    })
  })

  describe('when cart has product(s)', () => {
    const state = mkTestState({
      cart: { [Data.Product.a.id]: 3 },
      products: { isLoading: false, items: [Data.Product.a] },
    })

    it('should not disable remove all button', () => {
      const { getByLabelText } = render(
        <Handlers.provider value={handlers}>
          <Cart.component state={state} />
        </Handlers.provider>
      )

      expect(getByLabelText(/remove all/i)).toBeEnabled()
    })

    it('should render total price', () => {
      const { getByTestId } = render(
        <Handlers.provider value={handlers}>
          <Cart.component state={state} />
        </Handlers.provider>
      )

      expect(getByTestId('total-price')).toHaveTextContent(
        '$' + Data.Product.a.price * 3
      )
    })
  })
})
