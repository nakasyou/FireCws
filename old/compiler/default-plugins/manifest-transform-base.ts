import type { Plugin } from '../core/mod.ts'

interface Manifest2 {
  update_url?: string
  browser_specific_settings?: {
    gecko?: {
      id?: string
      strict_min_version?: string
    }  
  }
  background?: {
    scripts?: string[]
    service_worker?: string
  }
  commands?: Record<string, {
    suggested_key?: {
      default?: string
    } | string
  }>
}

// todo: リファクタリング
export const manifestTransformBase: Plugin = {
  name: 'manifest-transfrom-base',
  
  onCompile(init) {
    const { manifest } = init as {
      manifest: Manifest2
    }

    /**
     * `browser_specific_settings`を埋める
     * `browser_specific_settings`がなければインストールできない
     */
    ;(() => {
      if (!manifest.browser_specific_settings) {
        manifest.browser_specific_settings = {}
      }
      if (!manifest.browser_specific_settings.gecko) {
        manifest.browser_specific_settings.gecko = {}
      }
      if (!manifest.browser_specific_settings.gecko.id) {
        manifest.browser_specific_settings.gecko.id = "example@example.com"
      }
      if (!manifest.browser_specific_settings.gecko.strict_min_version) {
        manifest.browser_specific_settings.gecko.strict_min_version = '42.0'
      }
    })()

    /**
     * Firefoxちゃんが background に繊細らしいの
     */
    ;(() => {
      if (!manifest.background) {
        return // background属性なければ不要
      }
      if (!manifest.background.scripts) {
        manifest.background.scripts = []
      }
      if (manifest.background.service_worker) {
        manifest.background.scripts.push(manifest.background.service_worker)
        manifest.background.service_worker = undefined
      }
    })()

    /**
     * Firefoxちゃんが commands に繊細らしいの
     * 
     * ```json
     * {
     *   "commands": {
     *     "x": {
     *       "suggested_key": "xxxx"
     *     }
     *   }
     * }
     * ```
     * を
     * ```json
     * {
     *   "commands": {
     *     "x": {
     *       "suggested_key": {
     *         "default": "xxxx"
     *       }
     *     }
     *   }
     * }
     * ```
     * にする
     */
    ;(() => {
      if (!manifest.commands) {
        return // commands属性なければ不要
      }

      for (const [key, value] of Object.entries(manifest.commands)) {
        if (typeof value.suggested_key === "string") {
          value.suggested_key = {
            default: value.suggested_key
          }
        }
        if (!value.suggested_key) {
          value.suggested_key = {}
        }
    
        manifest.commands[key] = value
      }
    })()

    /**
     * Delete `update_url`
     */
    ;(() => {
      manifest.update_url = undefined
    })()
  }
}
