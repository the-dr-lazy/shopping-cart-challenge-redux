import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import * as Store from '~/store'
import { Home, Cart } from '~/pages'
import { Handlers } from '~/handlers'

type Props = {
  handlers: Handlers
}

export function component({ handlers }: Props) {
  const state = useSelector(Store.getState)

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
