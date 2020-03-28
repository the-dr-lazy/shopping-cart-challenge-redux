import * as Redux from 'redux'
import { createEpicMiddleware } from 'redux-observable'

import { Environment } from '~/environment'
import { reducer, epic } from './root'

export type { State } from './root'
export { fetchProducts, Product } from './products'
export { addProductToCart, removeProductFromCart, clearCart } from './cart'

export function createStore(environment: Environment) {
  const epicMiddleware = createEpicMiddleware({ dependencies: environment })

  const store = Redux.createStore(
    reducer,
    Redux.applyMiddleware(epicMiddleware)
  )

  epicMiddleware.run(epic)

  return store
}
