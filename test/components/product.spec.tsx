import React from 'react'
import { fireEvent } from '@testing-library/react'

import * as Product from '~/components/product'

import * as Data from '../data'
import { render, createHandlers } from '../utils'

describe('<Product.component  {...handlers} />', () => {
  it('should render product image', () => {
    const handlers = createHandlers()

    const { container } = render(
      <Product.component product={Data.Product.a} {...handlers} />
    )

    expect(container.querySelector('img')).not.toBeNull()
  })

  it('should render product image src', () => {
    const handlers = createHandlers()

    const { container } = render(
      <Product.component product={Data.Product.a} {...handlers} />
    )

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      Data.Product.a.image
    )
  })

  it('should render product image alt', () => {
    const handlers = createHandlers()

    const { container } = render(
      <Product.component product={Data.Product.a} {...handlers} />
    )

    expect(container.querySelector('img')).toHaveAttribute(
      'alt',
      expect.stringContaining(Data.Product.a.name)
    )
  })

  it('should render product name', () => {
    const handlers = createHandlers()

    const { queryByText } = render(
      <Product.component product={Data.Product.a} {...handlers} />
    )

    expect(queryByText(Data.Product.a.name)).not.toBeNull()
  })

  it('should render price', () => {
    const handlers = createHandlers()

    const { queryByText } = render(
      <Product.component product={Data.Product.a} {...handlers} />
    )

    expect(
      queryByText(`$${Data.Product.a.price}`, { exact: false })
    ).not.toBeNull()
  })

  describe('when click on add to cart button', () => {
    it('should call onAddProductToCart callback', () => {
      const handlers = createHandlers({
        onAddProductToCart: jest.fn(),
      })

      const { getByLabelText } = render(
        <Product.component product={Data.Product.a} {...handlers} />
      )

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(handlers.onAddProductToCart).toBeCalled()
    })

    it('should apply correct product ID to onAddProductToCart callback', () => {
      const handlers = createHandlers({
        onAddProductToCart: jest.fn(),
      })

      const { getByLabelText } = render(
        <Product.component product={Data.Product.a} {...handlers} />
      )

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(handlers.onAddProductToCart).toBeCalledWith(Data.Product.a.id)
    })
  })
})
