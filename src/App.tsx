import React from 'react'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import * as Store from '~/Store'
import { Home, Cart } from '~/Page'
import { useHandlers } from '~/Handlers'
import { defineDisplayName } from '~/Utils'

export function component() {
  const state = useSelector(Store.getState)
  const { onFetchProducts } = useHandlers()

  React.useEffect(() => {
    onFetchProducts()
  }, [])

  return (
    <>
      <Route path="/" exact>
        <Home.component state={state} />
      </Route>
      <Route path="/cart" exact>
        <Cart.component state={state} />
      </Route>
    </>
  )
}

defineDisplayName('App', { component })
