import * as A from 'fp-ts/lib/ReadonlyArray'
import { constTrue, constFalse, constant } from 'fp-ts/lib/function'
import { combineReducers } from 'redux'
import { Observable, of } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import {
  createActionCreator,
  createReducer,
  ofType,
  ActionType,
  DeepImmutable,
} from 'deox'

import { Environment } from '~/environment'

//
// Data Types
//

export type ProductId = string

/*
 * Did you know that Product type is a product type in algebra? :|
 */
export type Product = {
  id: ProductId
  name: string
  price: number
  image: string
}

type State = DeepImmutable<ReturnType<typeof reducer>>

type Action = ActionType<typeof reducer>

//
// Action Creators
//

export const fetchProducts = {
  /**
   * Requests next products fetching
   */
  next: createActionCreator('[Products] fetch/next'),

  /**
   * Finishs products fetching with an error
   */
  error: createActionCreator('[Products] fetch/error', (resolve) => () =>
    resolve(new Error())
  ),

  /**
   * Completes products fetching
   */
  complete: createActionCreator(
    '[Products] fetch/complete',
    (resolve) => (items: ReadonlyArray<Product>) => resolve(items)
  ),
}

//
// Reducers
//

const isLoadingInitialState = false

export const isLoadingReducer = createReducer(
  isLoadingInitialState,
  (handleAction) => [
    handleAction(fetchProducts.next, constTrue),
    handleAction([fetchProducts.error, fetchProducts.complete], constFalse),
  ]
)

const itemsInitialState: ReadonlyArray<Product> = []

export const itemsReducer = createReducer(itemsInitialState, (handleAction) => [
  handleAction(fetchProducts.complete, (_, { payload }) => payload),
])

export const reducer = combineReducers({
  isLoading: isLoadingReducer,
  items: itemsReducer,
})

//
// Selectors
//

export function getIsProductsLoading({ isLoading }: State) {
  return isLoading
}

export function getProducts({ items }: State) {
  return items
}

export function getProduct(id: ProductId, { items }: State) {
  return A.findFirst<Product>((product) => product.id === id)(items)
}

//
// Epics
//

export function fetchProductsEpic(
  action$: Observable<Action>,
  _state$: Observable<State>,
  { API }: Environment
) {
  return action$.pipe(
    ofType(fetchProducts.next),
    mergeMap(() =>
      API.fetchProducts().pipe(
        map(fetchProducts.complete),
        catchError(constant(of(fetchProducts.error())))
      )
    )
  )
}

export const epic = fetchProductsEpic
