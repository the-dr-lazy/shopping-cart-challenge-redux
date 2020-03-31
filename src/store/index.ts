import * as Redux from 'redux'
import { createEpicMiddleware } from 'redux-observable'

import { Environment } from '~/environment'

import * as Cart from './cart'
import * as Products from './products'
import { reducer, epic, State, Action } from './root'

export function mkStore(environment: Environment) {
  const epicMiddleware = createEpicMiddleware<
    Action,
    Action,
    State,
    Environment
  >({ dependencies: environment })

  const store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(epicMiddleware)
  )

  epicMiddleware.run(epic)

  return store
}

export function rehydrate(store: Redux.Store) {
  store.dispatch(Cart.rehydrateCart.next())
}

export const fetchProducts = Products.fetchProducts.next

export { Product, ProductId } from './products'
export {
  Quantity,
  addProductToCart,
  removeProductFromCart,
  clearCart,
} from './cart'
export {
  State,
  getState,
  getIsProductsLoading,
  getProduct,
  getProducts,
  getCartQuantity,
  getCartQuantitySum,
  getCartTotalPrice,
  getCartEntity,
  getCartEntities,
  CartEntity,
} from './root'
export { Cart }
