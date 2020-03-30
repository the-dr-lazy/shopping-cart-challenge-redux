import { createActionCreator, createReducer } from 'deox'
import * as R from 'fp-ts/lib/Record'
import { increment, decrement, constant } from 'fp-ts/lib/function'
import { monoidSum } from 'fp-ts/lib/Monoid'

import { Product, ProductId } from './products'

//
// Data Types
//

export type Quantity = number

//
// Action Creators
//

/**
 * Resets cart.
 */
export const clearCart = createActionCreator('[Cart] clear')

/**
 * If the product has not been added to the cart, adds it to the cart.
 * otherwise increments it's quantity.
 */
export const addProductToCart = createActionCreator(
  '[Cart] add product',
  (resolve) => (productId: ProductId) => resolve(productId)
)

/**
 * Decrements quantity of the product in the cart to 1 and then removes it.
 * On absolute removing, it'll remove the product from the cart unconditionally.
 */
export const removeProductFromCart = createActionCreator(
  '[Cart] remove product',
  (resolve) => (productId: ProductId, absolute = false) =>
    resolve({ productId, absolute })
)

//
// Reducers
//

export type State = Record<ProductId, Quantity>

const initialState: State = {}

export const reducer = createReducer(initialState, (handleAction) => [
  handleAction(clearCart, constant(initialState)),

  handleAction(addProductToCart, (state, { payload }) => ({
    ...state,
    [payload]: increment(state[payload] || 0),
  })),

  handleAction(removeProductFromCart, (state, { payload }) => {
    const { productId, absolute } = payload
    const dissociated = R.deleteAt(productId)(state)

    if (absolute) {
      return dissociated
    }

    const quantity = state[productId]

    return {
      ...dissociated,
      ...(quantity > 1 ? { [productId]: decrement(quantity) } : {}),
    }
  }),
])

//
// Selectors
//

export function getCartQuantity(productId: ProductId, state: State) {
  return R.lookup(productId, state)
}

export function getCartQuantitySum(state: State) {
  return R.reduce(monoidSum.empty, monoidSum.concat)(state)
}
