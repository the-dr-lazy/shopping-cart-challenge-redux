import React from 'react'

import { singularNounToPluralByQuantity } from '~/utils'
import * as Store from '~/store'

type MiniProps = {
  cartQuantitySum: number
}

export function mini({ cartQuantitySum }: MiniProps) {
  const itemNoun = singularNounToPluralByQuantity(cartQuantitySum, 'item')
  const message =
    cartQuantitySum > 0
      ? `You have ${cartQuantitySum} ${itemNoun} in your cart.`
      : `Your cart is empty.`

  return <div>{message}</div>
}

type RowProps = {
  product: Store.Product
  quantity: number
  onAddToCart?: (id: Store.ProductId) => void
  onRemoveFromCart?: (id: Store.ProductId) => void
  onAbsoluteRemoveFromCart?: (id: Store.ProductId) => void
}

export function row({
  product,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  onAbsoluteRemoveFromCart,
}: RowProps) {
  function handleIncrementQuantityButtonClick() {
    onAddToCart!(product.id)
  }

  function handleDecrementQuantityButtonClick() {
    onRemoveFromCart!(product.id)
  }

  function handleRemoveProductFromCartButtonClick() {
    onAbsoluteRemoveFromCart!(product.id)
  }

  const incrementQuantityButton = onAddToCart && (
    <button
      aria-label="Increase quantity"
      onClick={handleIncrementQuantityButtonClick}
    >
      +1
    </button>
  )
  const decrementQuantityButton = onRemoveFromCart && quantity > 1 && (
    <button
      aria-label="Decrease quantity"
      onClick={handleDecrementQuantityButtonClick}
    >
      -1
    </button>
  )
  const removeProductFromCartButton = onAbsoluteRemoveFromCart && (
    <button
      aria-label="Remove product from cart"
      onClick={handleRemoveProductFromCartButtonClick}
    >
      Remove 🗑
    </button>
  )

  return (
    <tr key={product.id}>
      <td>{product.name}</td>
      <td>{quantity}</td>
      <td>${product.price}</td>
      <td>${quantity * product.price}</td>
      <td>
        {[
          incrementQuantityButton,
          decrementQuantityButton,
          removeProductFromCartButton,
        ]}
      </td>
    </tr>
  )
}
