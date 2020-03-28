import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import * as Products from './products'

export type State = ReturnType<typeof reducer>

export const reducer = combineReducers({
  products: Products.reducer,
})

export const epic = combineEpics(Products.epic)
