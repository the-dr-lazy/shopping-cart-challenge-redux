import * as O from 'fp-ts/lib/Option'
import { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { Observable, defer, of } from 'rxjs'
import { Decoder } from 'io-ts'

import * as Store from '~/Store'
import { json } from '~/Utils'

const keys = <const>{
  cart: 'Store.Cart',
}

type Key = typeof keys extends Record<any, infer TKey> ? TKey : never

function set(key: Key, value: unknown): Observable<never> {
  return defer(() => localStorage.setItem(key, JSON.stringify(value)))
}

function get<A>(key: Key, decoder: Decoder<unknown, A>): Observable<Option<A>> {
  const value = pipe(
    localStorage.getItem(key),
    O.fromNullable,
    O.chain(json(decoder))
  )

  return of(value)
}

export function setCart(cart: Store.Cart.State) {
  return set(keys.cart, cart)
}

export function getCart() {
  return get(keys.cart, Store.Cart.StateC)
}
