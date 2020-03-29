import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import * as App from '~/app'
import * as Store from '~/store'
import { defaultEnvironment } from '~/environment'
import { mkHandlers } from '~/handlers'

const rootElement = document.getElementById('root')

function main() {
  const store = Store.mkStore(defaultEnvironment)
  const handlers = mkHandlers(store)

  ReactDOM.render(
    <Provider store={store}>
      <App.component handlers={handlers} />
    </Provider>,
    rootElement
  )
}

main()
