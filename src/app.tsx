import React from 'react'
import { identity } from 'fp-ts/lib/function'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Home, Cart } from '~/pages'
import { Handlers } from '~/handlers'

type Props = {
  handlers: Handlers
}

export function component({ handlers }: Props) {
  const state = useSelector(identity)

  React.useEffect(() => {
    handlers.onFetchProducts()
  }, [])

  return (
    <BrowserRouter>
      <Route
        path="/"
        render={() => <Home.component state={state} {...handlers} />}
        exact
      />
      <Route
        path="/cart"
        render={() => <Cart.component state={state} {...handlers} />}
        exact
      />
    </BrowserRouter>
  )
}
