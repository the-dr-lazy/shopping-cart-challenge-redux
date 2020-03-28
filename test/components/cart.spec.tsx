import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import * as Cart from '~/components/cart'

import * as Data from '../data'

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
  function renderIntoTBody(reactElement: React.ReactElement) {
    const tBody = document.createElement('tbody')

    return render(reactElement, { container: document.body.appendChild(tBody) })
  }

  it('should render product name', () => {
    const { queryByText } = renderIntoTBody(
      <Cart.row product={Data.Product.a} quantity={2} />
    )

    const element = queryByText(Data.Product.a.name, { exact: false })

    expect(element).not.toBeNull()
  })

  it('should render product quantity', () => {
    const { queryByText } = renderIntoTBody(
      <Cart.row product={Data.Product.a} quantity={3} />
    )

    expect(queryByText('3')).not.toBeNull()
  })

  it('should render product price', () => {
    const { queryByText } = renderIntoTBody(
      <Cart.row product={Data.Product.a} quantity={3} />
    )

    const element = queryByText(`$${Data.Product.a.price}`, { exact: false })

    expect(element).not.toBeNull()
  })

  it('should render total price', () => {
    const { queryByText } = renderIntoTBody(
      <Cart.row product={Data.Product.b} quantity={5} />
    )

    const element = queryByText(`$${Data.Product.b.price * 5}`, {
      exact: false,
    })

    expect(element).not.toBeNull()
  })

  describe('when quantity is one', () => {
    it('should not render remove from the cart button', () => {
      const onRemoveFromCart = jest.fn()

      const { queryByLabelText } = renderIntoTBody(
        <Cart.row
          product={Data.Product.a}
          quantity={1}
          onRemoveFromCart={onRemoveFromCart}
        />
      )

      expect(queryByLabelText(/decrease quantity/i)).toBeNull()
    })
  })

  describe('when click on add to the cart button', () => {
    it('should call onAddToCart callback', () => {
      const onAddToCart = jest.fn()

      const { getByLabelText } = renderIntoTBody(
        <Cart.row
          product={Data.Product.a}
          quantity={1}
          onAddToCart={onAddToCart}
        />
      )

      fireEvent.click(getByLabelText(/increase quantity/i))

      expect(onAddToCart).toBeCalled()
    })

    it('should apply correct product ID to onAddToCart callback', () => {
      const onAddToCart = jest.fn()

      const { getByLabelText } = renderIntoTBody(
        <Cart.row
          product={Data.Product.b}
          quantity={1}
          onAddToCart={onAddToCart}
        />
      )

      fireEvent.click(getByLabelText(/increase quantity/i))

      expect(onAddToCart).toBeCalledWith(Data.Product.b.id)
    })
  })

  describe('when click on remove from the cart button', () => {
    it('should call onRemoveFromCart callback', () => {
      const onRemoveFromCart = jest.fn()

      const { getByLabelText } = renderIntoTBody(
        <Cart.row
          product={Data.Product.a}
          quantity={2}
          onRemoveFromCart={onRemoveFromCart}
        />
      )

      fireEvent.click(getByLabelText(/decrease quantity/i))

      expect(onRemoveFromCart).toBeCalled()
    })

    it('should apply correct product ID to onRemoveFromCart callback', () => {
      const onRemoveFromCart = jest.fn()

      const { getByLabelText } = renderIntoTBody(
        <Cart.row
          product={Data.Product.b}
          quantity={2}
          onRemoveFromCart={onRemoveFromCart}
        />
      )

      fireEvent.click(getByLabelText(/decrease quantity/i))

      expect(onRemoveFromCart).toBeCalledWith(Data.Product.b.id)
    })
  })

  describe('when click on absolute remove from the cart button', () => {
    it('should call onAbsoluteRemoveFromCart callback', () => {
      const onAbsoluteRemoveFromCart = jest.fn()

      const { getByLabelText } = renderIntoTBody(
        <Cart.row
          product={Data.Product.a}
          quantity={1}
          onAbsoluteRemoveFromCart={onAbsoluteRemoveFromCart}
        />
      )

      fireEvent.click(getByLabelText(/remove product/i))

      expect(onAbsoluteRemoveFromCart).toBeCalled()
    })

    it('should apply correct product ID to onAbsoluteRemoveFromCart callback', () => {
      const onAbsoluteRemoveFromCart = jest.fn()

      const { getByLabelText } = renderIntoTBody(
        <Cart.row
          product={Data.Product.b}
          quantity={1}
          onAbsoluteRemoveFromCart={onAbsoluteRemoveFromCart}
        />
      )

      fireEvent.click(getByLabelText(/remove product/i))

      expect(onAbsoluteRemoveFromCart).toBeCalledWith(Data.Product.b.id)
    })
  })
})
