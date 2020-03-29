import React from 'react'

import * as Store from '~/store'
import { Product, Cart } from '~/components'
import { PropsWithHandlers } from '~/handlers'

type Props = PropsWithHandlers<{ state: Store.State }, 'onAddProductToCart'>

export function component({ state, onAddProductToCart }: Props) {
  const products = Store.getProducts(state).map((product) => (
    <li key={product.id}>
      <Product.component
        product={product}
        onAddProductToCart={onAddProductToCart}
      />
    </li>
  ))
  const isLoading = Store.getIsProductsLoading(state)
  const cartQuantitySum = Store.getCartQuantitySum(state)

  return (
    <div>
      <Cart.mini cartQuantitySum={cartQuantitySum} />

      {isLoading && <p>Loading...</p>}
      <ul>{products}</ul>
    </div>
  )
}
