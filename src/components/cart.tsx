import React from 'react'
import { Link } from 'react-router-dom'

import * as Store from '~/store'
import { PropsWithHandlers } from '~/handlers'
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

type RowProps = PropsWithHandlers<
  { entity: Store.CartEntity },
  'onAddProductToCart' | 'onRemoveProductFromCart'
>

export function row({
  entity,
  onAddProductToCart,
  onRemoveProductFromCart,
}: RowProps) {
  const { id, name, price, quantity } = entity

  function handleIncrementQuantityButtonClick() {
    onAddProductToCart(id)
  }

  function handleDecrementQuantityButtonClick() {
    onRemoveProductFromCart(id)
  }

  function handleRemoveProductButtonClick() {
    onRemoveProductFromCart(id, true)
  }

  const incrementQuantityButton = (
    <button
      aria-label="Increase quantity"
      onClick={handleIncrementQuantityButtonClick}
    >
      +1
    </button>
  )
  const decrementQuantityButton = (
    <button
      aria-label="Decrease quantity"
      disabled={quantity <= 1}
      onClick={handleDecrementQuantityButtonClick}
    >
      -1
    </button>
  )
  const removeProductButton = (
    <button
      aria-label="Remove product from cart"
      onClick={handleRemoveProductButtonClick}
    >
      Remove 🗑
    </button>
  )

  return (
    <tr>
      <td>{name}</td>
      <td>{quantity}</td>
      <td>${price}</td>
      <td>${quantity * price}</td>
      <td>
        {incrementQuantityButton}
        {decrementQuantityButton}
        {removeProductButton}
      </td>
    </tr>
  )
}
