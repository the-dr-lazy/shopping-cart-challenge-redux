import React from 'react'

import * as Store from '~/store'
import { Product, Cart } from '~/components'
import { Handlers } from '~/handlers'

type Props = {
  state: Store.State
  onAddProductToCart?: Handlers['onAddProductToCart']
}

export function component({ state, onAddProductToCart }: Props) {
  const { products } = state

  const list = products.items.map((product) => (
    <li key={product.id}>
      <Product.component
        product={product}
        onAddProductToCart={onAddProductToCart}
      />
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
