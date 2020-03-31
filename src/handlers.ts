import * as Redux from 'redux'

import * as Store from '~/store'

export type Handlers = {
  onFetchProducts(): void
  onAddProductToCart(productId: Store.ProductId): void
  onRemoveProductFromCart(productId: Store.ProductId, absolute?: boolean): void
  onClearCart(): void
}

export type PropsWithHandlers<T, K extends keyof Handlers> = T &
  Pick<Handlers, K>

const handlers = {
  onFetchProducts: Store.fetchProducts,
  onAddProductToCart: Store.addProductToCart,
  onRemoveProductFromCart: Store.removeProductFromCart,
  onClearCart: Store.clearCart,
}

export function mkHandlers(store: Redux.Store) {
  return Redux.bindActionCreators(handlers, store.dispatch)
}
