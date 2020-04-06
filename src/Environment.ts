import { DeepImmutable } from 'deox'

import * as API from '~/API'
import * as storage from '~/Storage'

export type Environment = DeepImmutable<{
  API: typeof API
  storage: typeof storage
}>

export const defaultEnvironment: Environment = { API, storage }
