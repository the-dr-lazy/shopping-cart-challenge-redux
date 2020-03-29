import * as Redux from 'redux'
import { createEpicMiddleware } from 'redux-observable'

import { Environment } from '~/environment'

import { reducer, epic } from './root'

export function createStore(environment: Environment) {
  const epicMiddleware = createEpicMiddleware({ dependencies: environment })

  const store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(epicMiddleware)
  )

  epicMiddleware.run(epic)

  return store
}

export { fetchProducts, Product, ProductId } from './products'
export {
  addProductToCart,
  removeProductFromCart,
  clearCart,
  Quantity,
} from './cart'
export {
  getIsProductsLoading,
  getProduct,
  getProducts,
  getCartQuantity,
  getCartQuantitySum,
  getCartTotalPrice,
  getCartEntity,
  getCartEntities,
  CartEntity,
  State,
} from './root'
