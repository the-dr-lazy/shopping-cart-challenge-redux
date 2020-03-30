import * as R from 'fp-ts/lib/ReadonlyRecord'
import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'
import { monoidSum } from 'fp-ts/lib/Monoid'
import { increment, decrement, constant } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'
import { createActionCreator, createReducer } from 'deox'

import { constZero } from '~/utils'

import { ProductId } from './products'

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

export type State = R.ReadonlyRecord<ProductId, Quantity>

const initialState: State = {}

export const reducer = createReducer(initialState, (handleAction) => [
  handleAction(clearCart, constant(initialState)),

  handleAction(addProductToCart, (state, { payload }) => ({
    ...state,
    [payload]: incrementQuantity(payload, state),
  })),

  handleAction(removeProductFromCart, (state, { payload }) => {
    const { productId, absolute } = payload
    const dissociated = R.deleteAt(productId)(state)

    const quantity = getCartQuantity(productId, state, true)

    if (absolute || quantity <= 1) {
      return dissociated
    }

    return {
      ...dissociated,
      [productId]: decrement(quantity),
    }
  }),
])

function incrementQuantity(productId: ProductId, state: State) {
  return pipe(getCartQuantity(productId, state, true), increment)
}

//
// Selectors
//

export function getCartQuantity(
  productId: ProductId,
  state: State,
  isomorphism: true
): Quantity
export function getCartQuantity(
  productId: ProductId,
  state: State,
  isomorphism: false
): Option<Quantity>
export function getCartQuantity(
  productId: ProductId,
  state: State
): Option<Quantity>
export function getCartQuantity(
  productId: ProductId,
  state: State,
  isomorphism = false
) {
  const quantity = R.lookup(productId, state)

  return isomorphism ? O.getOrElse(constZero)(quantity) : quantity
}

export function getCartQuantitySum(state: State) {
  return R.reduce(monoidSum.empty, monoidSum.concat)(state)
}
