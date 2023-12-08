import type { CompileResult } from "./compile/mod.ts"
import { Compiler } from "./compiler.ts"

export interface ExtensionMetadata {
  extensionId?: string
}
export class Extension {
  #crxData: Uint8Array
  #compiler: Compiler
  #metadata: ExtensionMetadata

  constructor (data: Uint8Array, compiler: Compiler, metadata?: ExtensionMetadata) {
    this.#crxData = data
    this.#compiler = compiler
    
    if (!metadata) {
      metadata = {}
    }
    this.#metadata = metadata
  }

  /**
   * Compile this extension to xpi
   * @returns Compiled xpi file
   */
  compile (): CompileResult {
    return this.#compiler.compile(this)
  }

  getCrxData (): Uint8Array {
    return this.#crxData
  }

  getMetadata () {
    return this.#metadata
  }
}
