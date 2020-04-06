import React from 'react'
import { fireEvent } from '@testing-library/react'

import * as Store from '~/Store'
import * as Handlers from '~/Handlers'
import * as List from '~/Component/Product/List'

import * as Data from '~/Test/Data'
import { render, mkTestHandlers } from '~/Test/Utils'

describe('Component.Product.List.item', () => {
  it('should render product image', () => {
    const handlers = mkTestHandlers()

    const { container } = render(
      <Handlers.provider value={handlers}>
        <List.item product={Data.Product.a} />
      </Handlers.provider>
    )

    expect(container.querySelector('img')).not.toBeNull()
  })

  it('should render product image src', () => {
    const handlers = mkTestHandlers()

    const { container } = render(
      <Handlers.provider value={handlers}>
        <List.item product={Data.Product.a} />
      </Handlers.provider>
    )

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      Data.Product.a.image
    )
  })

  it('should render product image alt', () => {
    const handlers = mkTestHandlers()

    const { container } = render(
      <Handlers.provider value={handlers}>
        <List.item product={Data.Product.a} />
      </Handlers.provider>
    )

    expect(container.querySelector('img')).toHaveAttribute(
      'alt',
      expect.stringContaining(Data.Product.a.name)
    )
  })

  it('should render product name', () => {
    const handlers = mkTestHandlers()

    const { queryByText } = render(
      <Handlers.provider value={handlers}>
        <List.item product={Data.Product.a} />
      </Handlers.provider>
    )

    expect(queryByText(Data.Product.a.name)).not.toBeNull()
  })

  it('should render price', () => {
    const handlers = mkTestHandlers()

    const { queryByText } = render(
      <Handlers.provider value={handlers}>
        <List.item product={Data.Product.a} />
      </Handlers.provider>
    )

    expect(
      queryByText(`$${Data.Product.a.price}`, { exact: false })
    ).not.toBeNull()
  })

  describe('when click on add to cart button', () => {
    it('should call onAddProductToCart callback', () => {
      const handlers = mkTestHandlers({
        onAddProductToCart: jest.fn(),
      })

      const { getByLabelText } = render(
        <Handlers.provider value={handlers}>
          <List.item product={Data.Product.a} />
        </Handlers.provider>
      )

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(handlers.onAddProductToCart).toBeCalled()
    })

    it('should apply correct product ID to onAddProductToCart callback', () => {
      const handlers = mkTestHandlers({
        onAddProductToCart: jest.fn(),
      })

      const { getByLabelText } = render(
        <Handlers.provider value={handlers}>
          <List.item product={Data.Product.a} />
        </Handlers.provider>
      )

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(handlers.onAddProductToCart).toBeCalledWith(Data.Product.a.id)
    })
  })
})

describe('Component.Product.List.component', () => {
  describe('when there is not any product', () => {
    const products: ReadonlyArray<Store.Product> = []

    it('should not render any product', () => {
      const { container } = render(<List.component products={products} />)

      expect(container.querySelector('ul')?.childNodes.length).toBe(0)
    })
  })

  describe('when ', () => {
    const products = [Data.Product.a, Data.Product.b]

    it('should render products', () => {
      const { container } = render(<List.component products={products} />)

      expect(container.querySelector('ul')?.childNodes.length).toBe(2)
    })
  })
})
