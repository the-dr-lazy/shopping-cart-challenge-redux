import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import * as App from '~/app'
import * as Store from '~/store'
import { mkStore } from '~/store'
import { mkHandlers } from '~/handlers'
import { defaultEnvironment } from '~/environment'

const rootElement = document.getElementById('root')

function main() {
  const store = mkStore(defaultEnvironment)
  const handlers = mkHandlers(store)

  Store.rehydrate(store)

  // @ts-ignore
  window.store = store

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App.component handlers={handlers} />
      </BrowserRouter>
    </Provider>,
    rootElement
  )
}

main()
