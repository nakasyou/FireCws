import type { CompileResult } from "./compile/mod.ts"
import { Compiler } from "./compiler.ts"

export class Extension {
  #crxData: Uint8Array
  #compiler: Compiler
  constructor (data: Uint8Array, compiler: Compiler) {
    this.#crxData = data
    this.#compiler = compiler
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
}
