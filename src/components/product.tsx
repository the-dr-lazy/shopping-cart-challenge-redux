import React from 'react'

import * as Store from '~/store'
import { PropsWithHandlers } from '~/handlers'

type Props = PropsWithHandlers<{ product: Store.Product }, 'onAddProductToCart'>

export function component({ product, onAddProductToCart }: Props) {
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
