import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import * as Products from './products'
import * as Cart from './cart'

export type State = ReturnType<typeof reducer>

export const reducer = combineReducers({
  products: Products.reducer,
  cart: Cart.reducer,
})

export const epic = combineEpics(Products.epic)
