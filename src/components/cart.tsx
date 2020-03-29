import React from 'react'
import { Link } from 'react-router-dom'

import * as Store from '~/store'
import { Handlers } from '~/handlers'
import { singularNounToPluralByQuantity } from '~/utils'

type MiniProps = {
  cartQuantitySum: number
}

export function mini({ cartQuantitySum }: MiniProps) {
  const itemNoun = singularNounToPluralByQuantity(cartQuantitySum, 'item')
  const message =
    cartQuantitySum > 0
      ? `You have ${cartQuantitySum} ${itemNoun} in your cart.`
      : `Your cart is empty.`

  return (
    <div>
      <Link to="/cart">Cart</Link>
      <div>{message}</div>
    </div>
  )
}

type RowProps = {
  product: Store.Product
  quantity: number
  onAddProductToCart?: Handlers['onAddProductToCart']
  onRemoveProductFromCart?: Handlers['onRemoveProductFromCart']
}

export function row({
  product,
  quantity,
  onAddProductToCart,
  onRemoveProductFromCart,
}: RowProps) {
  function handleIncrementQuantityButtonClick() {
    onAddProductToCart!(product.id)
  }

  function handleDecrementQuantityButtonClick() {
    onRemoveProductFromCart!(product.id)
  }

  function handleRemoveProductButtonClick() {
    onRemoveProductFromCart!(product.id, true)
  }

  const incrementQuantityButton = onAddProductToCart && (
    <button
      aria-label="Increase quantity"
      onClick={handleIncrementQuantityButtonClick}
    >
      +1
    </button>
  )
  const decrementQuantityButton = onRemoveProductFromCart && (
    <button
      aria-label="Decrease quantity"
      disabled={quantity <= 1}
      onClick={handleDecrementQuantityButtonClick}
    >
      -1
    </button>
  )
  const removeProductButton = onRemoveProductFromCart && (
    <button
      aria-label="Remove product from cart"
      onClick={handleRemoveProductButtonClick}
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
          removeProductButton,
        ]}
      </td>
    </tr>
  )
}
