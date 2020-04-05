import React from 'react'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import * as Store from '~/store'
import { Home, Cart } from '~/pages'
import { useHandlers } from '~/handlers'
import { defineDisplayName } from '~/utils'

export function component() {
  const state = useSelector(Store.getState)
  const handlers = useHandlers()

  React.useEffect(() => {
    handlers.onFetchProducts()
  }, [])

  return (
    <>
      <Route path="/" exact>
        <Home.component state={state} {...handlers} />
      </Route>
      <Route path="/cart" exact>
        <Cart.component state={state} {...handlers} />
      </Route>
    </>
  )
}

defineDisplayName('App', { component })
