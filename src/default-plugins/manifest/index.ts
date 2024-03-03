import { array, object, optional, safeParse, string } from 'valibot'
import type { Plugin } from '../../plugin'
import { schema, transform } from './transformer'

const browser_specific_settingsSchema = object({
  gecko: optional(
    object({
      id: optional(string(), 'example@exapmle.com'),
      strict_min_version: optional(string(), '42.0')
    }),
    {
      id: 'example@example.com',
      strict_min_version: '42.0'
    }
  )
})

const manifestTransformSchema = schema({
  default: {
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'"
    }
  },
  entries: {
    /**
     * `browser_specific_settings`を埋める
     * `browser_specific_settings`がなければインストールできない
     */
    browser_specific_settings: {
      transform(data) {
        const parsed = safeParse(browser_specific_settingsSchema, data)
        const result = parsed.success
          ? parsed.output
          : {
              gecho: {
                id: 'example@example.com',
                strict_min_version: '42.0'
              }
            }
        return result
      }
    },
    /**
     * Firefoxちゃんが background に繊細らしいの
     */
    background: {
      transform(data) {
        if (!data) {
          return
        }
        const background = data as {
          scripts?: string[]
          service_worker?: string
        }
        if (!background.scripts) {
          background.scripts = []
        }
        if (background.service_worker) {
          background.scripts.push(background.service_worker)
        }
        background.service_worker = undefined
        return background
      }
    },
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
    commands: {
      transform(data) {
        if (!data) {
          return {}
        }
        const commands = data as {
          [key: string]:
            | {
                suggested_key:
                  | string
                  | {
                      default?: string
                    }
              }
            | undefined
        }
        for (const [key, value] of Object.entries(commands)) {
          if (!value) {
            continue
          }
          if (typeof value.suggested_key === 'string') {
            value.suggested_key = {
              default: value.suggested_key
            }
          }
          if (!value.suggested_key) {
            value.suggested_key = {}
          }
          commands[key] = value
        }
        return commands
      }
    },
    /**
     * Delete `update_url`
     */
    update_url: {
      transform: () => undefined
    },
    content_security_policy: {
      transform(data) {
        console.log(data)
        // biome-ignore lint/suspicious/noExplicitAny: any
        let newData = data as any
        if (!newData) {
          newData = {}
        }
        if (!newData.extension_pages) {
          newData.extension_pages = "script-src 'self' 'wasm-unsafe-eval'"
        }
        return newData
      },
    }
  }
})
/**
 * ChromeのあいまいなManifestを繊細ちゃんなFirefoxでも使えるようにしてあげるPlugin
 */
export const manifestPlugin = (): Plugin => ({
  name: 'main',
  task: async (compileData) => {
    const { manifest } = compileData
    Object.assign(
      // biome-ignore lint/suspicious/noExplicitAny: any
      compileData.manifest as any,
      await transform(manifestTransformSchema, compileData.manifest)
    )
    return
  }
})
