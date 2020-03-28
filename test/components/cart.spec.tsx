import React from 'react'
import { render } from '@testing-library/react'

import * as Cart from '~/components/cart'

describe('<Cart.mini />', () => {
  describe('when the sum of the cart quantity is zero', () => {
    const { container } = render(<Cart.mini cartQuantitySum={0} />)

    it('should render empty message', () => {
      expect(container.firstChild).toHaveTextContent(/cart is empty/i)
    })
  })

  describe('when the sum of the cart quantity is one', () => {
    it('should render sum of the cart quantity', () => {
      const { container } = render(<Cart.mini cartQuantitySum={1} />)

      expect(container.firstChild).toHaveTextContent(/1/)
    })
  })

  describe('when the sum of the cart quantity is greater than one', () => {
    it('should render sum of the cart quantity', () => {
      const { container } = render(<Cart.mini cartQuantitySum={11} />)

      expect(container.firstChild).toHaveTextContent(/11/)
    })
  })
})
