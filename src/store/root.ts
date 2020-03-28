import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import * as Products from './products'
import * as Cart from './cart'

//
// Reducer
//

export type State = ReturnType<typeof reducer>

export const reducer = combineReducers({
  products: Products.reducer,
  cart: Cart.reducer,
})

//
// Epic
//

export const epic = combineEpics(Products.epic)

//
// Selector
//

export function getCartEntries({ products, cart }: State) {
  return Object.entries(cart).map(([productId, quantity]) => {
    const product = products.items.find(
      ({ id }) => id.toString() === productId
    )!

    return <[Products.Product, number]>[product, quantity]
  })
}

export function getCartTotalPrice(state: State) {
  return getCartEntries(state).reduce(
    (total, [{ price }, quantity]) => total + price * quantity,
    0
  )
}

export function getCartQuantitySum({ cart }: State) {
  return Cart.getCartQuantitySum(cart)
}
