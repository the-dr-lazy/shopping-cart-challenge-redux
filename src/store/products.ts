import * as R from 'rambda'
import { combineReducers } from 'redux'
import { Observable, of } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import { createActionCreator, createReducer, ofType, ActionType } from 'deox'

import { Environment } from '~/environment'

//
// Data Types
//

export type ProductId = number

/*
 * Did you know that Product type is a product type in algebra? :|
 */
export type Product = {
  id: ProductId
  name: string
  price: number
  image: string
}

//
// Action Creators
//

export const fetchProducts = {
  next: createActionCreator('[Products] fetch/next'),
  error: createActionCreator('[Products] fetch/error', (resolve) => () =>
    resolve(new Error())
  ),
  complete: createActionCreator(
    '[Products] fetch/complete',
    (resolve) => (items: Product[]) => resolve(items)
  ),
}

//
// Reducers
//

const isLoadingInitialState = false

export const isLoadingReducer = createReducer(
  isLoadingInitialState,
  (handleAction) => [
    handleAction(fetchProducts.next, R.always(true)),
    handleAction(
      [fetchProducts.error, fetchProducts.complete],
      R.always(false)
    ),
  ]
)

const itemsInitialState: Product[] = []

export const itemsReducer = createReducer(itemsInitialState, (handleAction) => [
  handleAction(fetchProducts.complete, (_, { payload }) => payload),
])

type Action = ActionType<typeof reducer>

export const reducer = combineReducers({
  isLoading: isLoadingReducer,
  items: itemsReducer,
})

//
// Epics
//

export function fetchProductsEpic(
  action$: Observable<Action>,
  _state$: any,
  { API }: Environment
) {
  return action$.pipe(
    ofType(fetchProducts.next),
    mergeMap(() =>
      API.fetchProducts.pipe(
        map(fetchProducts.complete),
        catchError(() => of(fetchProducts.error()))
      )
    )
  )
}

export const epic = fetchProductsEpic
