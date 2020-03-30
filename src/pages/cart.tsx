import React from 'react'
import { Link } from 'react-router-dom'

import * as Store from '~/store'
import { PropsWithHandlers } from '~/handlers'
import { Cart } from '~/components'

type Props = PropsWithHandlers<
  { state: Store.State },
  'onAddProductToCart' | 'onRemoveProductFromCart' | 'onClearCart'
>

export function component({
  state,
  onAddProductToCart,
  onRemoveProductFromCart,
  onClearCart,
}: Props) {
  const { products } = state

  if (products.isLoading) {
    return loading
  }

  const rows = Store.getCartEntities(state).map((entity) => (
    <Cart.row
      key={entity.id}
      entity={entity}
      onAddProductToCart={onAddProductToCart}
      onRemoveProductFromCart={onRemoveProductFromCart}
    />
  ))

  const quantitySum = Store.getCartQuantitySum(state)
  const totalPrice = Store.getCartTotalPrice(state)

  return (
    <div>
      <Link to="/">Home</Link>
      <table className="w-100 b-1 m-4">
        <thead>
          <tr>
            <td>name</td>
            <td>quantity</td>
            <td>price</td>
            <td>total row</td>
            <td>actions</td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <button
        aria-label="remove all"
        disabled={quantitySum === 0}
        onClick={onClearCart}
      >
        Remove All
      </button>
      <h1 data-testid="total-price">Total ${totalPrice}</h1>
    </div>
  )
}

const loading = (
  <div>
    <Link to="/">Home</Link>
    <p>Loading...</p>
  </div>
)
