import * as R from 'rambda'
import { createActionCreator, createReducer } from 'deox'

import { ProductId } from './products'

//
// Data Types
//

export type Quantity = number

//
// Action Creators
//

export const clearCart = createActionCreator('[Cart] clear')
export const addProductToCart = createActionCreator(
  '[Cart] add product',
  (resolve) => (productId: number) => resolve(productId)
)
export const removeProductFromCart = createActionCreator(
  '[Cart] remove product',
  (resolve) => (productId: number, absolute = false) =>
    resolve({ productId, absolute })
)

//
// Reducers
//

export type State = { [key in ProductId]: Quantity }

const initialState: State = {}

export const reducer = createReducer(initialState, (handleAction) => [
  handleAction(clearCart, R.always({})),
  handleAction(addProductToCart, (state, { payload }) => ({
    ...state,
    [payload]: R.inc(state[payload] || 0),
  })),
  handleAction(removeProductFromCart, (state, { payload }) => {
    const { productId, absolute } = payload
    const dissociated = R.dissoc<State>(productId.toString(), state)

    if (absolute) {
      return dissociated
    }

    const quantity = state[productId]

    return {
      ...dissociated,
      ...(quantity > 1 ? { [productId]: R.dec(quantity) } : {}),
    }
  }),
])

//
// Selectors
//

export function getCartQuantitySum(state: State) {
  return R.sum(Object.values(state))
}
