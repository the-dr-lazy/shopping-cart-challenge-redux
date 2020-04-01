import React from 'react'
import { Link } from 'react-router-dom'

import { singularNounToPluralByQuantity, defineDisplayName } from '~/utils'

type MiniProps = {
  cartQuantitySum: number
}

export function component({ cartQuantitySum }: MiniProps) {
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

component.memo = React.memo(component)

defineDisplayName('Component.Cart.Mini', { component })
