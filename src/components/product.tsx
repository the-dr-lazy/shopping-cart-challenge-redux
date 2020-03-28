import React from 'react'

import * as Store from '~/store'

type Props = {
  product: Store.Product
  onAddToCart?: (id: Store.ProductId) => void
}

export function component({ product, onAddToCart }: Props) {
  function handleAddToCartButtonClick() {
    onAddToCart!(product.id)
  }

  const addToCartButton = onAddToCart && (
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
