import React from 'react'

import * as Store from '~/store'

type Props = {
  product: Store.Product
  onAddToCart?: (id: Store.ProductId) => void
}

export function component({ product, onAddToCart }: Props) {
  function handleAddToCartButtonClick() {
    onAddToCart && onAddToCart(product.id)
  }

  return (
    <div className="mb-4 p-4 b-1 text-center">
      <img src={product.image} alt={product.name} />
      <p>{product.name}</p>
      <p>price: ${product.price}</p>
      <button onClick={handleAddToCartButtonClick}>Add To Cart</button>
    </div>
  )
}
