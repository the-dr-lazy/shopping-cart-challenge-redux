import React from 'react'

import * as Mini from '~/Component/Cart/Mini'

import { render } from '~/Test/Utils'

describe('Component.Cart.Mini.component', () => {
  describe('when the sum of the cart quantity is zero', () => {
    const { container } = render(<Mini.component cartQuantitySum={0} />)

    it('should render empty message', () => {
      expect(container.firstChild).toHaveTextContent(/cart is empty/i)
    })
  })

  describe('when the sum of the cart quantity is one', () => {
    it('should render sum of the cart quantity', () => {
      const { container } = render(<Mini.component cartQuantitySum={1} />)

      expect(container.firstChild).toHaveTextContent(/1/)
    })
  })

  describe('when the sum of the cart quantity is greater than one', () => {
    it('should render sum of the cart quantity', () => {
      const { container } = render(<Mini.component cartQuantitySum={11} />)

      expect(container.firstChild).toHaveTextContent(/11/)
    })
  })
})
