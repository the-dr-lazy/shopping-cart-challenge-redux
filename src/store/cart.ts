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
  (resolve) => (id: number) => resolve(id)
)
export const removeProductFromCart = createActionCreator(
  '[Cart] remove product',
  (resolve) => (id: number) => resolve(id)
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
    const quantity = state[payload]

    return {
      ...R.dissoc<State>(payload.toString(), state),
      ...(quantity > 1 ? { [payload]: R.dec(quantity) } : {}),
    }
  }),
])

//
// Selectors
//

export function getCartQuantitySum(state: State) {
  return R.sum(Object.values(state))
}
