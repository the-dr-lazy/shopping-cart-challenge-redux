import React from 'react'

import * as Store from '~/Store'
import { Product, Cart } from '~/Component'
import { defineDisplayName } from '~/Utils'

type Props = { state: Store.State }

export function component({ state }: Props) {
  const products = Store.getProducts(state)
  const isLoading = Store.getIsProductsLoading(state)
  const cartQuantitySum = Store.getCartQuantitySum(state)

  return (
    <div>
      <Cart.Mini.component.memo cartQuantitySum={cartQuantitySum} />

      {isLoading && <p>Loading...</p>}
      <Product.List.component.memo products={products} />
    </div>
  )
}

defineDisplayName('Page.Home', { component })
