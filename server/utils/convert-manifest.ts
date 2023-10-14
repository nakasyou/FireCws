import { z } from 'zod'

interface Manifest2 {
  applications?: {
    gecko?: {
      id?: string
      strict_min_version?: string
    }
  }
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
}
interface Manifest3 {
  applications: {
    gecko: {
      id: string
      strict_min_version: string
    }
  }
  browser_specific_settings: {
    gecko: {
      id: string
      strict_min_version: string
    }
  }
  background?: {
    scripts?: string[]
  }
}

export const convertManifest = (manifest: Manifest2): Manifest3 => {
  // applicationsを埋める
  if (!manifest.applications) {
    manifest.applications = {}
  }
  if (!manifest.applications.gecko) {
    manifest.applications.gecko = {}
  }
  if (!manifest.applications.gecko.id) {
    manifest.applications.gecko.id = "example@example.com"
  }
  if (!manifest.applications.gecko.strict_min_version) {
    manifest.applications.gecko.strict_min_version = "42.0"
  }

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

  return manifest
}