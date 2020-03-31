import * as R from 'fp-ts/lib/Record'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/ReadonlyArray'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { identity } from 'fp-ts/lib/function'
import { combineReducers } from 'redux'
import { ActionType } from 'deox'
import { Observable, merge } from 'rxjs'
import { map } from 'rxjs/operators'

import { somes } from '~/utils'
import { Environment } from '~/environment'

import * as Products from './products'
import * as Cart from './cart'
import { Product, ProductId } from './products'
import { Quantity } from './cart'

//
// Data Types
//

export type CartEntity = Product & { quantity: Cart.Quantity }

export function mkCartEntity(product: Product) {
  return (quantity: Quantity) => ({ ...product, quantity })
}

export type State = ReturnType<typeof reducer>

export type Action = ActionType<typeof reducer>

//
// Reducers
//

export const reducer = combineReducers({
  products: Products.reducer,
  cart: Cart.reducer,
})

//
// Selectors
//

/**
 * Identity for root state
 */
export const getState: (state: State) => State = identity

export function getIsProductsLoading({ products }: State) {
  return Products.getIsProductsLoading(products)
}

export function getProduct(id: Products.ProductId, { products }: State) {
  return Products.getProduct(id, products)
}

export function getProducts({ products }: State) {
  return Products.getProducts(products)
}

export function getCart({ cart }: State) {
  return cart
}

export function getCartQuantity(productId: ProductId, { cart }: State) {
  return Cart.getCartQuantity(productId, cart)
}

export function getCartQuantitySum({ cart }: State) {
  return Cart.getCartQuantitySum(cart)
}

export function getCartTotalPrice(state: State) {
  return getCartEntities(state).reduce(
    (total, { price, quantity }) => total + price * quantity,
    0
  )
}

export function getCartEntity(
  productId: ProductId,
  state: State
): Option<CartEntity> {
  const product = getProduct(productId, state)
  const quantity = getCartQuantity(productId, state)

  return pipe(product, O.map(mkCartEntity), O.ap(quantity))
}

export function getCartEntities(state: State) {
  return pipe(
    state.cart,
    R.keys,
    A.map((productId) => getCartEntity(productId, state)),
    somes
  )
}

//
// Epics
//

export function epic(
  action$: Observable<Action>,
  state$: Observable<State>,
  environment: Environment
) {
  return merge(
    Products.epic(
      action$,
      state$.pipe(map(({ products }) => products)),
      environment
    ),
    Cart.epic(action$, state$.pipe(map(getCart)), environment)
  )
}
