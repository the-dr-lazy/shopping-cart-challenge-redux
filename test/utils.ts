import merge from 'deepmerge'
import * as TestingLibrary from '@testing-library/react'
import { ReactElement } from 'react'
import { AnyAction } from 'deox'
import { Observable } from 'rxjs'
import { marbles } from 'rxjs-marbles/marbles'
import { MemoryRouter } from 'react-router-dom'

import { State } from '~/store'
import { reducer } from '~/store/root'
import { Environment } from '~/environment'
import { Handlers } from '~/handlers'

type CreateReducerSpec<TState, TAction extends AnyAction> = {
  action: TAction
  state: TState
  expected: TState
}

export function createReducerTest<TState, TAction extends AnyAction>(
  reducer: (state: TState, action: TAction) => TState,
  { state, action, expected }: CreateReducerSpec<TState, TAction>
) {
  return () => {
    const output = reducer(state, action)

    expect(output).toEqual(expected)
  }
}

type CreateEpicTestSpec<
  TInput extends AnyAction,
  TOutput extends AnyAction,
  TState
  > = {
    marbles: {
      state?: string
      action: string
      expected: string
    }
    values: {
      state?: { [key: string]: TState }
      action: { [key: string]: TInput }
      expected: { [key: string]: TOutput }
    }
  }

export function createEpicTest<
  TInput extends AnyAction,
  TOutput extends AnyAction,
  TState,
  TEnvironment
>(
  epic: (
    action$: Observable<TInput>,
    state$: Observable<TState>,
    environment: TEnvironment
  ) => Observable<TOutput>,
  environment: TEnvironment,
  spec: CreateEpicTestSpec<TInput, TOutput, TState>
) {
  return marbles((m) => {
    const state$ = m.hot(spec.marbles.state || '', spec.values.state)
    const action$ = m.hot(spec.marbles.action, spec.values.action)
    const expected$ = m.cold(spec.marbles.expected, spec.values.expected)

    const output$ = epic(action$, state$, environment)

    m.expect(output$).toBeObservable(expected$)
  })
}

type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

export function createEnvironment(
  environment: DeepPartial<Environment>
): Environment {
  return <any>environment
}

export function render(
  reactElement: ReactElement,
  tagName: keyof HTMLElementTagNameMap = 'div'
) {
  const element = document.createElement(tagName)

  return TestingLibrary.render(reactElement, {
    wrapper: MemoryRouter,
    container: document.body.appendChild(element),
  })
}

export function createHandlers(handlers: Partial<Handlers> = {}) {
  return <any>handlers
}

export function createState(state: DeepPartial<State> = {}) {
  return merge(reducer(undefined, { type: '@@INIT' }), state)
}
