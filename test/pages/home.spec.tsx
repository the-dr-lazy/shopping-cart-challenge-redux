import React from 'react'
import { render } from '@testing-library/react'

import * as Home from '~/pages/home'

import * as Data from '../data'

describe('<Home.component />', () => {
  describe('when products are loading', () => {
    const state = {
      cart: {},
      products: { isLoading: true, items: [] },
    }

    it('should render a loading message', () => {
      const { queryByText } = render(<Home.component state={state} />)

      expect(queryByText(/loading/i)).not.toBeNull()
    })

    it('should not render any product', () => {
      const { container } = render(<Home.component state={state} />)

      expect(container.querySelector('ul')?.childNodes.length).toBe(0)
    })
  })

  describe('when products has been loaded', () => {
    const state = {
      cart: {},
      products: {
        isLoading: false,
        items: [Data.Product.a, Data.Product.b],
      },
    }

    it('should not render loading message', () => {
      const { queryByText } = render(<Home.component state={state} />)

      expect(queryByText(/loading/i)).toBeNull()
    })

    it('should render products', () => {
      const { container } = render(<Home.component state={state} />)

      expect(container.querySelector('ul')?.childNodes.length).toBe(2)
    })
  })
})