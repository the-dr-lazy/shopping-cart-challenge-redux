import React from 'react'

import * as Store from '~/store'
import { Handlers } from '~/handlers'

type Props = {
  product: Store.Product
  onAddProductToCart?: Handlers['onAddProductToCart']
}

export function component({ product, onAddProductToCart }: Props) {
  function handleAddToCartButtonClick() {
    onAddProductToCart!(product.id)
  }

  const addToCartButton = onAddProductToCart && (
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
