import * as API from './api'
import { DeepImmutable } from 'deox'

export type Environment = DeepImmutable<{
  API: typeof API
}>

export const defaultEnvironment: Environment = { API }
