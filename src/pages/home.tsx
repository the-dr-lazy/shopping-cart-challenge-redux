import React from 'react'

import * as Store from '~/store'
import { Product, Cart } from '~/components'

type Props = {
  state: Store.State
}

export function component({ state }: Props) {
  const { products } = state

  const list = products.items.map((product) => (
    <li key={product.id}>
      <Product.component product={product} />
    </li>
  ))

  return (
    <div>
      <Cart.mini cartQuantitySum={Store.getCartQuantitySum(state)} />

      {products.isLoading && <p>Loading</p>}
      <ul>{list}</ul>
    </div>
  )
}
