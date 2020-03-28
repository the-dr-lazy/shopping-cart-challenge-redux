import React from 'react'

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

  return <div>{message}</div>
}
