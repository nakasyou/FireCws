import {
  object,
  type Input,
  number,
  optional,
  array,
  any,
  type AnySchema,
  type Output,
  unknown,
  custom,
  type UnknownSchema,
  type BaseSchema,
  union,
  boolean,
  string,
} from 'valibot'
import type { Plugin } from '../plugin'
import { defaultPlugins } from '../default-plugins'
import type { FileTree } from './compile-data'
import type { InitializeOptions } from 'esbuild-wasm'

type CustomSchema<T> = AnySchema<T>

export const compileOptionsSchema = object({
  version: optional(number(), 100),
  plugins: optional(array(any() as CustomSchema<Plugin>), defaultPlugins()),
  esbuildInitializeOptions: union([
    object({
      worker: optional(boolean()),
      wasmURL: optional(union([string(), any() as BaseSchema<URL, URL>]))
    }),
    object({
      worker: optional(boolean()),
      wasmModule: optional(any() as BaseSchema<WebAssembly.Module, WebAssembly.Module>)
    })
  ])
})

export type SafeCompileOptions = Required<CompileOptions>
export interface CompileOptions extends Input<typeof compileOptionsSchema> {
  /**
   * Firefox major version
   */
  version?: number

  plugins?: Plugin[]
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
