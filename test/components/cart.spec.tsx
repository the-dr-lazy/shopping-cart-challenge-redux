import React from 'react'
import { fireEvent } from '@testing-library/react'

import * as Cart from '~/components/cart'

import * as Data from '../data'
import { render } from '../utils'

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

describe('<Cart.row />', () => {
  it('should render product name', () => {
    const { queryByText } = render(
      <Cart.row product={Data.Product.a} quantity={2} />,
      'tbody'
    )

    const element = queryByText(Data.Product.a.name, { exact: false })

    expect(element).not.toBeNull()
  })

  it('should render product quantity', () => {
    const { queryByText } = render(
      <Cart.row product={Data.Product.a} quantity={3} />,
      'tbody'
    )

    expect(queryByText('3')).not.toBeNull()
  })

  it('should render product price', () => {
    const { queryByText } = render(
      <Cart.row product={Data.Product.a} quantity={3} />,
      'tbody'
    )

    const element = queryByText(`$${Data.Product.a.price}`, { exact: false })

    expect(element).not.toBeNull()
  })

  it('should render total price', () => {
    const { queryByText } = render(
      <Cart.row product={Data.Product.b} quantity={5} />,
      'tbody'
    )

    const element = queryByText(`$${Data.Product.b.price * 5}`, {
      exact: false,
    })

    expect(element).not.toBeNull()
  })

  describe('when quantity is one', () => {
    it('should disable decrease quantity button', () => {
      const onRemoveProductFromCart = jest.fn()

      const { queryByLabelText } = render(
        <Cart.row
          product={Data.Product.a}
          quantity={1}
          onRemoveProductFromCart={onRemoveProductFromCart}
        />,
        'tbody'
      )

      expect(queryByLabelText(/decrease quantity/i)).toBeDisabled()
    })
  })

  describe('when click on increment quantity button', () => {
    it('should call onAddProductToCart callback', () => {
      const onAddProductToCart = jest.fn()

      const { getByLabelText } = render(
        <Cart.row
          product={Data.Product.a}
          quantity={1}
          onAddProductToCart={onAddProductToCart}
        />,
        'tbody'
      )

      fireEvent.click(getByLabelText(/increase quantity/i))

      expect(onAddProductToCart).toBeCalled()
    })

    it('should apply correct product ID to onAddProductToCart callback', () => {
      const onAddProductToCart = jest.fn()

      const { getByLabelText } = render(
        <Cart.row
          product={Data.Product.b}
          quantity={1}
          onAddProductToCart={onAddProductToCart}
        />,
        'tbody'
      )

      fireEvent.click(getByLabelText(/increase quantity/i))

      expect(onAddProductToCart).toBeCalledWith(Data.Product.b.id)
    })
  })

  describe('when click on decrement quantity button', () => {
    it('should call onRemoveProductFromCart callback', () => {
      const onRemoveProductFromCart = jest.fn()

      const { getByLabelText } = render(
        <Cart.row
          product={Data.Product.a}
          quantity={2}
          onRemoveProductFromCart={onRemoveProductFromCart}
        />,
        'tbody'
      )

      fireEvent.click(getByLabelText(/decrease quantity/i))

      expect(onRemoveProductFromCart).toBeCalled()
    })

    it('should apply correct product ID to onRemoveProductFromCart callback', () => {
      const onRemoveProductFromCart = jest.fn()

      const { getByLabelText } = render(
        <Cart.row
          product={Data.Product.b}
          quantity={2}
          onRemoveProductFromCart={onRemoveProductFromCart}
        />,
        'tbody'
      )

      fireEvent.click(getByLabelText(/decrease quantity/i))

      expect(onRemoveProductFromCart).toBeCalledWith(Data.Product.b.id)
    })
  })

  describe('when click on remove from the cart button', () => {
    it('should call onRemoveProductFromCart callback', () => {
      const onAbsoluteRemoveProductFromCart = jest.fn()

      const { getByLabelText } = render(
        <Cart.row
          product={Data.Product.a}
          quantity={1}
          onRemoveProductFromCart={onAbsoluteRemoveProductFromCart}
        />,
        'tbody'
      )

      fireEvent.click(getByLabelText(/remove product/i))

      expect(onAbsoluteRemoveProductFromCart).toBeCalled()
    })

    it('should apply correct product ID to onRemoveProductFromCart callback', () => {
      const onAbsoluteRemoveProductFromCart = jest.fn()

      const { getByLabelText } = render(
        <Cart.row
          product={Data.Product.b}
          quantity={1}
          onRemoveProductFromCart={onAbsoluteRemoveProductFromCart}
        />,
        'tbody'
      )

      fireEvent.click(getByLabelText(/remove product/i))

      expect(onAbsoluteRemoveProductFromCart).toBeCalledWith(
        Data.Product.b.id,
        true
      )
    })
  })
})
