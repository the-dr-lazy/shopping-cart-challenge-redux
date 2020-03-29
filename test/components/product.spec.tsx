import React from 'react'
import { fireEvent } from '@testing-library/react'

import * as Product from '~/components/product'

import * as Data from '../data'
import { render } from '../utils'

describe('<Product.component />', () => {
  it('should render product image', () => {
    const { container } = render(<Product.component product={Data.Product.a} />)

    expect(container.querySelector('img')).not.toBeNull()
  })

  it('should render product image src', () => {
    const { container } = render(<Product.component product={Data.Product.a} />)

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      Data.Product.a.image
    )
  })

  it('should render product image alt', () => {
    const { container } = render(<Product.component product={Data.Product.a} />)

    expect(container.querySelector('img')).toHaveAttribute(
      'alt',
      expect.stringContaining(Data.Product.a.name)
    )
  })

  it('should render product name', () => {
    const { queryByText } = render(
      <Product.component product={Data.Product.a} />
    )

    expect(queryByText(Data.Product.a.name)).not.toBeNull()
  })

  it('should render price', () => {
    const { queryByText } = render(
      <Product.component product={Data.Product.a} />
    )

    expect(
      queryByText(`$${Data.Product.a.price}`, { exact: false })
    ).not.toBeNull()
  })

  describe('when click on add to cart button', () => {
    it('should call onAddProductToCart callback', () => {
      const onAddProductToCart = jest.fn()

      const { getByLabelText } = render(
        <Product.component
          product={Data.Product.a}
          onAddProductToCart={onAddProductToCart}
        />
      )

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(onAddProductToCart).toBeCalled()
    })

    it('should apply correct product ID to onAddProductToCart callback', () => {
      const onAddProductToCart = jest.fn()

      const { getByLabelText } = render(
        <Product.component
          product={Data.Product.a}
          onAddProductToCart={onAddProductToCart}
        />
      )

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(onAddProductToCart).toBeCalledWith(Data.Product.a.id)
    })
  })
})
