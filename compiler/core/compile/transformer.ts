import { z } from 'npm:zod'

interface Manifest2 {
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
const Manifest3 = z.object({
  browser_specific_settings: z.object({
    gecko: z.object({
      id: z.string(),
      strict_min_version: z.string()
    })
  }),
  background: z.object({
    scripts: z.array(z.string())
  }),
  commands: z.record(z.object({
    suggested_key: z.object({
      default: z.string().optional()
    })
  }))
})
type Manifest3 = z.infer<typeof Manifest3>

// todo: リファクタリング
export const transformManifest = (manifest: Manifest2): Manifest3 => {
  // browser_specific_settingsを埋める
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
    manifest.browser_specific_settings.gecko.strict_min_version = "42.0"
  }

  if (!manifest.background) {
    manifest.background = {}
  }
  if (!manifest.background.scripts) {
    manifest.background.scripts = []
  }
  if (manifest.background.service_worker) {
    manifest.background.scripts.push(manifest.background.service_worker)
    manifest.background.service_worker = undefined
  }

  if (!manifest.commands) {
    manifest.commands = {}
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
  
  return manifest as Manifest3
}