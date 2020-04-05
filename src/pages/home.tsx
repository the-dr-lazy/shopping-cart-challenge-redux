import React from 'react'

import * as Store from '~/store'
import { Product, Cart } from '~/components'
import { defineDisplayName } from '~/utils'

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
