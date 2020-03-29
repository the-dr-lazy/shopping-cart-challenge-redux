import React from 'react'
import * as R from 'rambda'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Home, Cart } from '~/pages'
import { Handlers } from '~/handlers'

type Props = {
  handlers: Handlers
}

export function component({ handlers }: Props) {
  const state = useSelector(R.identity)

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
