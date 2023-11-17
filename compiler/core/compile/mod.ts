import type { Extension, CompilerInit } from "../mod.ts"
import crxToZip from '../../lib/crx-to-zip.js'
import { unzipSync, zipSync } from '../../deps/fflate.ts'
import defaultPlugins from './plugins/mod.ts'

export const compile = (chromeExtension: Extension, opts: CompilerInit): Uint8Array => {
  const crxData = chromeExtension.getCrxData()
  const zipData = crxToZip(crxData)
  const fileTree: Record<string, Uint8Array | undefined> = unzipSync(zipData)
  
  if (!fileTree['manifest.json']) {
    throw new Error('manifest.json is not found.')
  }
  const manifestJson = JSON.parse(new TextDecoder().decode(fileTree['manifest.json']))
  
  const plugins = [...Object.entries(defaultPlugins).filter(([name, plugin]) => {
    const enabledThisPlugin = ((opts.enablePlugins || {}) as Record<string, boolean | undefined>)[name]
    if (enabledThisPlugin) {
      return enabledThisPlugin
    }
    return plugin.enabled
  }).map(plugin => plugin[1].plugin)]

  for (const plugin of plugins) {
    plugin({
      fileTree,
      manifest: manifestJson
    })
  }

  fileTree['manifest.json'] = new TextEncoder().encode(JSON.stringify(manifestJson, null, 2))

  const xpiData = zipSync(fileTree as Record<string, Uint8Array>)

  return xpiData
}
