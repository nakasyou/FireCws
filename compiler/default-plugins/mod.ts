import type { Plugins } from '../core/mod.ts'
import { indexedDBDatabases } from "./indexed-db-databases/mod.ts"

import { manifestTransformBase } from "./manifest-transform-base.ts"

export default (): Plugins => {
  const result = [
    manifestTransformBase,
    indexedDBDatabases
  ] satisfies Plugins
  return result
}
