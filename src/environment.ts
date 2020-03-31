import { DeepImmutable } from 'deox'

import * as API from './api'
import * as storage from './storage'

export type Environment = DeepImmutable<{
  API: typeof API
  storage: typeof storage
}>

export const defaultEnvironment: Environment = { API, storage }
