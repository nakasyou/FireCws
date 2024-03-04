import type { Plugin } from '../plugin'
import { defaultPlugins } from '../default-plugins'
import type { FileTree } from './compile-data'
import type { InitializeOptions } from 'esbuild-wasm'

export type SafeCompileOptions = Required<CompileOptions>

export interface CompileOptions {
  /**
   * Firefox major version
   */
  version?: number

  plugins?: Plugin[]

  esbuildInitializeOptions?: InitializeOptions
}

export type CompileProgres =
  | { type: 'STARTED_CRX_TO_ZIP' }
  | { type: 'FINISHED_CRX_TO_ZIP' }
  | { type: 'STARTED_UNZIP' }
  | { type: 'FINISHED_UNZIP' }
  | {
      type: 'FINISHED_RUNNING_PLUGIN_TASK'
      pluginName: string
      plugins: number
      pluginIndex: number
      tasks: number
      taskIndex: number
    }
  | {
      type: 'FINISHED_RUNNING_PLUGIN'
      pluginName: string
      plugins: number
      pluginIndex: number
    }
  | { type: 'FINISHED_COMPILEING' }
  | {
      type: 'FROM_PLUGIN'
      pluginName: string
      message: unknown
    }
export interface CompileResult {
  xpi: Uint8Array
  fileTree: FileTree
}
