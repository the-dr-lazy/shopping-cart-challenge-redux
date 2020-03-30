import { isSome, Option } from 'fp-ts/lib/Option'
import { constant } from 'fp-ts/lib/function'

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
