import { Plugin } from '../core/mod.ts'

export const csp: Plugin = {
  name: 'CSP',
  onCompile(init) {
    if (!init.manifest.content_security_policy) {
      init.manifest.content_security_policy = {}
    }
    if (!init.manifest.content_security_policy.extension_pages) {
      init.manifest.content_security_policy.extension_pages = "script-src 'self' 'wasm-unsafe-eval'"
    }
  },
}