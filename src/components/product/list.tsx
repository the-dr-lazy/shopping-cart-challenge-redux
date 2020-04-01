import React from 'react'

import * as Store from '~/store'
import { PropsWithHandlers } from '~/handlers'
import { defineDisplayName } from '~/utils'

type ItemProps = PropsWithHandlers<
  { product: Store.Product },
  'onAddProductToCart'
>

export function item({ product, onAddProductToCart }: ItemProps) {
  const { id, name, price, image } = product

  function handleAddToCartButtonClick() {
    onAddProductToCart(id)
  }

  const addToCartButton = (
    <button aria-label="Add to cart" onClick={handleAddToCartButtonClick}>
      Add To Cart
    </button>
  )

  return (
    <div className="mb-4 p-4 b-1 text-center">
      <img src={image} alt={name} />
      <p>{name}</p>
      <p>price: ${price}</p>
      {addToCartButton}
    </div>
  )
}

item.memo = React.memo(item)

type Props = PropsWithHandlers<
  { products: ReadonlyArray<Store.Product> },
  'onAddProductToCart'
>

export function component({ products, ...handlers }: Props) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {React.createElement(item.memo, { product, ...handlers })}
        </li>
      ))}
    </ul>
  )
}

component.memo = React.memo(component)

defineDisplayName('Component.Product.List', { item, component })
