import React from 'react'

import * as Home from '~/pages/home'

import * as Data from '../data'
import { render, mkTestHandlers, mkTestState } from '../utils'

describe('Page.Home.component', () => {
  const handlers = mkTestHandlers()

  describe('when products are loading', () => {
    const state = mkTestState({
      products: { isLoading: true },
    })

    it('should render a loading message', () => {
      const { queryByText } = render(
        <Home.component state={state} {...handlers} />
      )

      expect(queryByText(/loading/i)).not.toBeNull()
    })

    it('should not render any product', () => {
      const { container } = render(
        <Home.component state={state} {...handlers} />
      )

      expect(container.querySelector('ul')?.childNodes.length).toBe(0)
    })
  })

  describe('when products has been loaded', () => {
    const state = mkTestState({
      products: {
        items: [Data.Product.a, Data.Product.b],
      },
    })

    it('should not render loading message', () => {
      const { queryByText } = render(
        <Home.component state={state} {...handlers} />
      )

      expect(queryByText(/loading/i)).toBeNull()
    })

    it('should render products', () => {
      const { container } = render(
        <Home.component state={state} {...handlers} />
      )

      expect(container.querySelector('ul')?.childNodes.length).toBe(2)
    })
  })
})
