import { unzipSync, zipSync } from 'fflate'
import type { CrxExtension } from '../extension'
import crxToZip from '../lib/crx-to-zip'
import {
  type CompileOptions,
  type CompileProgres,
  type CompileResult,
  type SafeCompileOptions
} from './types'
import { CompileData } from './compile-data'
import { defaultPlugins } from '../default-plugins'

export const compile = async (
  crx: CrxExtension,
  options: CompileOptions,
  onProgres?: (progres: CompileProgres) => void
): Promise<CompileResult> => {
  const safeOptions: SafeCompileOptions = {
    esbuildInitializeOptions: options.esbuildInitializeOptions ?? {},
    version: options.version ?? 100,
    plugins: options.plugins ?? defaultPlugins()
  }

  const progresListener = onProgres ?? (() => null)
  // CRX to ZIP
  progresListener({ type: 'STARTED_CRX_TO_ZIP' })
  const zipUint8Array = crxToZip(crx.crx)
  progresListener({ type: 'FINISHED_CRX_TO_ZIP' })

  // UNZIP
  progresListener({ type: 'STARTED_UNZIP' })
  const fileTree = unzipSync(zipUint8Array)
  progresListener({ type: 'FINISHED_UNZIP' })

  // Create CompileData
  const compileData = new CompileData({
    fileTree,
    options: safeOptions,
    crx
  })
  await compileData.init()

  // Run Plugins
  let pluginIndex = 0
  const allPlugins = safeOptions.plugins.length
  for (const plugin of safeOptions.plugins) {
    await plugin.task(compileData, (message) => {
      // biome-ignore lint/complexity/useOptionalChain: Bug?
      onProgres && onProgres({
        type: 'FROM_PLUGIN',
        message,
        pluginName: plugin.name
      })
    })
    progresListener({
      type: 'FINISHED_RUNNING_PLUGIN',
      plugins: allPlugins,
      pluginIndex,
      pluginName: plugin.name
    })
    pluginIndex++
  }

  await compileData.used()

  // ZIP
  const xpi = zipSync(fileTree)

  const compileResult = {
    xpi,
    fileTree
  } satisfies CompileResult

  progresListener({
    type: 'FINISHED_COMPILEING'
  })

  return compileResult
}
