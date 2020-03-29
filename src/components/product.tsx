import React from 'react'

import * as Store from '~/store'
import { PropsWithHandlers } from '~/handlers'

type Props = PropsWithHandlers<{ product: Store.Product }, 'onAddProductToCart'>

export function component({ product, onAddProductToCart }: Props) {
  function handleAddToCartButtonClick() {
    onAddProductToCart(product.id)
  }

  const addToCartButton = (
    <button aria-label="Add to cart" onClick={handleAddToCartButtonClick}>
      Add To Cart
    </button>
  )

  return (
    <div className="mb-4 p-4 b-1 text-center">
      <img src={product.image} alt={product.name} />
      <p>{product.name}</p>
      <p>price: ${product.price}</p>
      {addToCartButton}
    </div>
  )
}
