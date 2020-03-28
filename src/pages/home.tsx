import React from 'react'

import * as Store from '~/store'
import { Product, Cart } from '~/components'

type Props = {
  state: Store.State
}

export function component(props: Props) {
  const { products, cart } = props.state

  const list = products.items.map((product) => (
    <li key={product.id}>
      <Product.component product={product} />
    </li>
  ))

  return (
    <div>
      <Cart.mini cartQuantitySum={Store.Cart.getQuantitySum(cart)} />

      {products.isLoading && <p>Loading</p>}
      <ul>{list}</ul>
    </div>
  )
}
