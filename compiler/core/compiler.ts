import { Extension } from "./extension.ts"
import { compile } from "./compile/mod.ts"
import plugins from './compile/plugins/mod.ts'
export interface CompilerInit {
  enablePlugins?: Record<keyof typeof plugins, boolean | undefined>
}
/**
 * Compiler for crx to xpi
 */
export class Compiler {
  opts: CompilerInit
  constructor (init?: CompilerInit) {
    if (!init) {
      init = {}
    }
    this.opts = init
  }

  /**
   * Create crx extension data from Uint8Array data
   * @param data crx file data
   * @returns Crx Extension Data instance
   */
  fromUint8Array (data: Uint8Array) {
    return new Extension(data, this)
  }

  /**
   * Compile extension to xpi
   * @param chromeExtension Extension
   */
  compile (chromeExtension: Extension): Uint8Array {
    return compile(chromeExtension, this.opts)
  }
}
