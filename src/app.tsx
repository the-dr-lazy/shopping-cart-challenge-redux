import React from 'react'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import * as Store from '~/store'
import { Home, Cart } from '~/pages'
import { Handlers } from '~/handlers'
import { defineDisplayName } from '~/utils'

type Props = {
  handlers: Handlers
}

export function component({ handlers }: Props) {
  const state = useSelector(Store.getState)

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
