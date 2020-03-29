import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import * as App from '~/app'
import * as Store from '~/store'
import { defaultEnvironment } from '~/environment'
import { createHandlers } from '~/handlers'

const rootElement = document.getElementById('root')

function main() {
  const store = Store.createStore(defaultEnvironment)
  const handlers = createHandlers(store)

  ReactDOM.render(
    <Provider store={store}>
      <App.component handlers={handlers} />
    </Provider>,
    rootElement
  )
}

main()
