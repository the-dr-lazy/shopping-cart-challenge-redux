import * as R from 'fp-ts/lib/ReadonlyRecord'
import * as O from 'fp-ts/lib/Option'
import * as t from 'io-ts'
import { Option } from 'fp-ts/lib/Option'
import { monoidSum } from 'fp-ts/lib/Monoid'
import { pipe } from 'fp-ts/lib/pipeable'
import { increment, decrement, constant } from 'fp-ts/lib/function'
import { Observable, of } from 'rxjs'
import { createActionCreator, createReducer, ofType, ActionType } from 'deox'
import {
  mergeMap,
  distinctUntilChanged,
  mergeMapTo,
  map,
  catchError,
  skipUntil,
  take,
  skip,
} from 'rxjs/operators'

import { Environment } from '~/environment'
import { constZero, combineEpics } from '~/utils'

import { ProductId } from './products'

//
// Data Types
//

export type Quantity = number

export const StateC = t.record(t.string, t.number)

export type State = t.TypeOf<typeof StateC>

export type Action = ActionType<typeof reducer>

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

export const rehydrateCart = {
  next: createActionCreator('[Cart] rehydrate/next'),
  error: createActionCreator('[Cart] rehydrate/error'),
  complete: createActionCreator(
    '[Cart] rehydrate/complete',
    (resolve) => (cart: State) => resolve(cart)
  ),
}

//
// Reducers
//

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

  handleAction(rehydrateCart.complete, (_, { payload }) => payload),
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

//
// Epics
//

export function persistCartEpic(
  action$: Observable<Action>,
  state$: Observable<State>,
  { storage }: Environment
) {
  return state$.pipe(
    skipUntil(action$.pipe(ofType(rehydrateCart.complete), take(1))),
    distinctUntilChanged(),
    skip(1),
    mergeMap((state) => storage.setCart(state))
  )
}

export function rehydrateCartEpic(
  action$: Observable<Action>,
  _state$: Observable<State>,
  { storage }: Environment
) {
  return action$.pipe(
    ofType(rehydrateCart.next),
    mergeMapTo(
      storage
        .getCart()
        .pipe(
          map(rehydrateCart.complete),
          catchError(constant(of(rehydrateCart.error())))
        )
    )
  )
}

export const epic = combineEpics(persistCartEpic, rehydrateCartEpic)
