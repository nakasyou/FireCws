import type { CompileJsCodeOpts } from '../compile'
import { polyfillDom } from './dom'
import { polyfillIndexedDB } from './indexeddb'

interface FakeObjects {
  window?: Window
  location?: Location
  globalThis?: typeof globalThis
  origin?: string
}

export default (opts: CompileJsCodeOpts) => {
  const fakeGlobal: FakeObjects = {}
  // IndexedDB
  polyfillIndexedDB(opts)

  // DOM
  polyfillDom()

  // location
  if (globalThis.location) {
    const fakeLocation = new Proxy(globalThis.location, {
      get(target, prop: keyof (typeof Location)['prototype']) {
        if (target.protocol === 'moz-extension:') {
          const url = new URL(target.href)
          url.protocol = 'chrome-extension:'
          url.hostname = opts.cwsId
          if (prop === 'ancestorOrigins') {
            return []
          }
          if (prop === 'assign' || prop === 'reload' || prop === 'replace') {
            return target[prop]
          }
          if (prop === 'origin') {
            return `chrome-extension://${opts.cwsId}`
          }
          return url[prop]
        }
        return target[prop]
      },
      set (target, prop, newValue) {
        // @ts-ignore 信じろ
        target[prop] = newValue
        return true
      }
    })
    fakeGlobal.location = fakeLocation

    Object.defineProperty(fakeGlobal, 'origin', {
      get () {
        return fakeLocation.origin
      }
    })
  }
  const createGlobalProxy = <T extends object>(globalObject: T): T => {
    return new Proxy(globalObject, {
      get(target, prop) {
        if (prop in fakeGlobal) {
          return fakeGlobal[prop as keyof typeof fakeGlobal]
        }
        // @ts-expect-error
        const value = target[prop]
        if (typeof value === 'function') {
          return value.bind(target)
        }
        return value
      },
      set (target, prop, newValue) {
        // @ts-ignore 信じろ
        target[prop] = newValue
        return true
      }
    })
  }
  // globalThis
  fakeGlobal.globalThis = createGlobalProxy(globalThis)
  // window
  if (globalThis.window) {
    fakeGlobal.window = createGlobalProxy(globalThis.window)
  }
  return fakeGlobal
}
