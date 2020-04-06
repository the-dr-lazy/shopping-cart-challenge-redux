import * as Redux from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension'

import { Environment } from '~/Environment'

import * as Cart from './Cart'
import * as Products from './Products'
import { reducer, epic, State, Action } from './Root'

export function mkStore(environment: Environment) {
  const epicMiddleware = createEpicMiddleware<
    Action,
    Action,
    State,
    Environment
  >({ dependencies: environment })

  const store = Redux.createStore(
    reducer,
    composeWithDevTools(Redux.applyMiddleware(epicMiddleware))
  )

  epicMiddleware.run(epic)

  return store
}

export function rehydrate(store: Redux.Store) {
  store.dispatch(Cart.rehydrateCart.next())
}

export const fetchProducts = Products.fetchProducts.next

export { Product, ProductId } from './Products'
export {
  Quantity,
  addProductToCart,
  removeProductFromCart,
  clearCart,
} from './Cart'
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
} from './Root'
export { Cart }
