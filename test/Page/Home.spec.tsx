import React from 'react'

import * as Handlers from '~/Handlers'
import * as Store from '~/Store'
import * as Home from '~/Page/Home'
import * as Data from '~/Test/Data'
import { render, mkTestHandlers, mkTestState } from '~/Test/Utils'

function renderHomeComponent(state: Store.State) {
  const handlers = mkTestHandlers()

  return render(
    <Handlers.provider value={handlers}>
      <Home.component state={state} />
    </Handlers.provider>
  )
}

describe('Page.Home.component', () => {
  describe('when products are loading', () => {
    const state = mkTestState({
      products: { isLoading: true },
    })

    it('should render a loading message', () => {
      const { queryByText } = renderHomeComponent(state)

      expect(queryByText(/loading/i)).not.toBeNull()
    })
  })

  describe('when products has been loaded', () => {
    const state = mkTestState({
      products: {
        items: [Data.Product.a, Data.Product.b],
      },
    })

    it('should not render loading message', () => {
      const { queryByText } = renderHomeComponent(state)

      expect(queryByText(/loading/i)).toBeNull()
    })
  })
})
