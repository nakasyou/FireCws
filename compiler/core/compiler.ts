import { Extension, type ExtensionMetadata } from "./extension.ts"
import { compile, type Plugin, type CompileResult } from "./compile/mod.ts"

export interface CompilerInit {
  /**
   * FireCws Plugins
   * @example
   * ```ts
   * new firecws.Compiler({
   *   plugins: [...firecws.defaultPlugins()] // Default Plugins
   * })
   * ```
   */
  plugins?: Plugin[]

  /**
   * Firefox major version
   * @example
   * ```ts
   * new Compiler({
   *   version: 115 // Firefox 115.4.0
   * })
   * ```
   */
  version?: number
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
  fromUint8Array (data: Uint8Array, metadata?: ExtensionMetadata) {
    return new Extension(data, this, metadata)
  }

  /**
   * Compile extension to xpi
   * @param chromeExtension Extension
   */
  compile (chromeExtension: Extension): CompileResult {
    return compile(chromeExtension, this.opts)
  }
}
