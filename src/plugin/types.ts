import type { CompileData } from '../compiler/compile-data'

type Log = (message: unknown) => void
export interface PluginTask {
  (compileData: CompileData, log: Log): void | Promise<void>
}
export interface Plugin {
  /**
   * Plugin name
   */
  name: string

  task: PluginTask
}
