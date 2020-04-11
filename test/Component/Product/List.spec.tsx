import React from 'react'
import { fireEvent } from '@testing-library/react'

import * as Store from '~/Store'
import * as Handlers from '~/Handlers'
import * as List from '~/Component/Product/List'

import * as Data from '~/Test/Data'
import { render, mkTestHandlers } from '~/Test/Utils'

function renderListItem(product: Store.Product, handlers = mkTestHandlers()) {
  return render(
    <Handlers.provider value={handlers}>
      <List.item product={product} />
    </Handlers.provider>
  )
}

describe('Component.Product.List.item', () => {
  it('should render product image', () => {
    const { container } = renderListItem(Data.Product.a)

    expect(container.querySelector('img')).not.toBeNull()
  })

  it('should render product image src', () => {
    const { container } = renderListItem(Data.Product.a)

    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      Data.Product.a.image
    )
  })

  it('should render product image alt', () => {
    const { container } = renderListItem(Data.Product.a)

    expect(container.querySelector('img')).toHaveAttribute(
      'alt',
      expect.stringContaining(Data.Product.a.name)
    )
  })

  it('should render product name', () => {
    const { queryByText } = renderListItem(Data.Product.a)

    expect(queryByText(Data.Product.a.name)).not.toBeNull()
  })

  it('should render price', () => {
    const { queryByText } = renderListItem(Data.Product.a)

    expect(
      queryByText(`$${Data.Product.a.price}`, { exact: false })
    ).not.toBeNull()
  })

  describe('when click on add to cart button', () => {
    it('should call onAddProductToCart callback', () => {
      const handlers = mkTestHandlers({
        onAddProductToCart: jest.fn(),
      })

      const { getByLabelText } = renderListItem(Data.Product.a, handlers)

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(handlers.onAddProductToCart).toBeCalled()
    })

    it('should apply correct product ID to onAddProductToCart callback', () => {
      const handlers = mkTestHandlers({
        onAddProductToCart: jest.fn(),
      })

      const { getByLabelText } = renderListItem(Data.Product.a, handlers)

      fireEvent.click(getByLabelText(/add to cart/i))

      expect(handlers.onAddProductToCart).toBeCalledWith(Data.Product.a.id)
    })
  })
})

function renderListComponent(products: ReadonlyArray<Store.Product>) {
  return render(<List.component products={products} />)
}

describe('Component.Product.List.component', () => {
  describe('when there is not any product', () => {
    const products: ReadonlyArray<Store.Product> = []

    it('should not render any product', () => {
      const { container } = renderListComponent(products)

      expect(container.querySelector('ul')?.childNodes.length).toBe(0)
    })
  })

  describe('when ', () => {
    const products = [Data.Product.a, Data.Product.b]

    it('should render products', () => {
      const { container } = renderListComponent(products)

      expect(container.querySelector('ul')?.childNodes.length).toBe(2)
    })
  })
})
