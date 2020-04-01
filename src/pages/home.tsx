import React from 'react'

import * as Store from '~/store'
import { Product, Cart } from '~/components'
import { PropsWithHandlers } from '~/handlers'
import { defineDisplayName } from '~/utils'

type Props = PropsWithHandlers<{ state: Store.State }, 'onAddProductToCart'>

export function component({ state, onAddProductToCart }: Props) {
  const products = Store.getProducts(state)
  const isLoading = Store.getIsProductsLoading(state)
  const cartQuantitySum = Store.getCartQuantitySum(state)

  return (
    <div>
      <Cart.Mini.component.memo cartQuantitySum={cartQuantitySum} />

      {isLoading && <p>Loading...</p>}
      <Product.List.component.memo
        products={products}
        onAddProductToCart={onAddProductToCart}
      />
    </div>
  )
}

defineDisplayName('Page.Home', { component })
