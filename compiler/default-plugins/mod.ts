import type { Plugins } from '../core/mod.ts'
import { dom } from './dom/mod.ts'
import { indexedDBDatabases } from "./indexed-db-databases/mod.ts"
import { csp } from "./csp.ts"
import { manifestTransformBase } from "./manifest-transform-base.ts"
import { transform } from "./transform/mod.ts"
export default (): Plugins => {
  const result = [
    manifestTransformBase,
    indexedDBDatabases,
    dom,
    csp,
    transform
  ] satisfies Plugins
  return result
}
