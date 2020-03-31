import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import { isSome, Option } from 'fp-ts/lib/Option'
import { parseJSON, toError } from 'fp-ts/lib/Either'
import { constant, flow } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'
import { Decoder } from 'io-ts'
import { Observable } from 'rxjs'
import { AnyAction } from 'deox'
import { combineEpics as combineEs } from 'redux-observable'

/**
 * A simple conversion from signular to plural for regular nouns!
 */
export function singularNounToPluralByQuantity(
  quantity: number,
  singular: string
) {
  return quantity >= 2 ? singular + 's' : singular
}

/**
 * Extracts from an array of `Option` all the `Some` elements.
 * All the `Some` elements are extracted in order
 */
export function somes<TValue>(
  xs: ReadonlyArray<Option<TValue>>
): ReadonlyArray<TValue> {
  const ys: Array<TValue> = []
  const len = xs.length
  for (let i = 0; i < len; i++) {
    const x = xs[i]
    if (isSome(x)) {
      ys.push(x.value)
    }
  }

  return ys
}

/**
 * A thunk that returns always `0`
 */
export const constZero = constant(0)

/**
 * Decodes JSON string to a type
 */
export function json<A>(decoder: Decoder<unknown, A>) {
  const decode = flow(decoder.decode, E.mapLeft(toError))

  return (input: string) =>
    pipe(parseJSON(input, toError), E.chain(decode), O.fromEither)
}

/**
 * Type adjusted epic!
 */
export type Epic<
  TInput extends AnyAction,
  TOutput extends AnyAction,
  TState,
  TEnvironment
> = (
  action$: Observable<TInput>,
  state$: Observable<TState>,
  environment: TEnvironment
) => Observable<TOutput>

/**
 * Identical as redux-observable's combineEpics with replaced Epic type.
 */
export function combineEpics<
  TInput extends AnyAction,
  TOutput extends AnyAction,
  TState,
  TEnvironment
>(
  ...epics: Epic<TInput, TOutput, TState, TEnvironment>[]
): Epic<TInput, TOutput, TState, TEnvironment>
export function combineEpics(
  ...args: Epic<AnyAction, AnyAction, unknown, unknown>[]
) {
  return combineEs(...args)
}
