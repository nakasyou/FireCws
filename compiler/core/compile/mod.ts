import type { Extension, CompilerInit } from "../mod.ts"
import crxToZip from '../../lib/crx-to-zip.js'
import { unzipSync, zipSync } from '../../deps/fflate.ts'
import type { ExtensionMetadata } from "../extension.ts"
export interface Plugin {
  /**
   * This plugin name
   */
  name: string

  /**
   * Compile event listener
   * @param init Utility datas and funcs for to compile
   */
  onCompile (init: {
    fileTree: Record<string, Uint8Array | undefined>
    manifest: any
    
    /**
     * Firefox major version
     */
    version: number

    open (path: string): File
    regexpWalk (regexp: RegExp): File[]

    metadata: ExtensionMetadata
  }): Promise<void> | void
}
interface File {
  read (): Uint8Array | undefined
  readText (): string | undefined
  write (data: Uint8Array): void
  writeText (data: string): void
  path: string
}
export type Plugins = Plugin[]

export interface CompileResult {
  compiled: Promise<Uint8Array>
  stateStream: ReadableStream<CompileState>
}
export type CompileState = {
  state: 'CRX_TO_ZIP'
} | {
  state: 'UNZIPING'
} | {
  state: 'ZIPING'
} | {
  state: 'COMPILED'
}

export const compile = (chromeExtension: Extension, opts: CompilerInit): CompileResult => {
  let compiledFunc: (data: Uint8Array) => void = () => undefined
  let nextStateFunc: (state: CompileState) => void = () => undefined
  const compiled: CompileResult['compiled'] = new Promise((resolve, reject) => {
    compiledFunc = (data) => {
      resolve(data)
    }
  })
  class StateStream extends ReadableStream<CompileState> {
    count = 0;
    constructor () {
      super({
        start(controller) {
          nextStateFunc = (state) => {
            controller.enqueue(state)
            if (state.state === "COMPILED") {
              controller.close()
            }
          }
        },
      })
    }
  }
  const stateStream = new StateStream()
  ;(async () => {
    const crxData = chromeExtension.getCrxData()
    nextStateFunc({
      state: 'CRX_TO_ZIP'
    })
    const zipData = crxToZip(crxData)
    nextStateFunc({
      state: 'UNZIPING'
    })
    const fileTree: Record<string, Uint8Array | undefined> = unzipSync(zipData)
    
    if (!fileTree['manifest.json']) {
      throw new Error('manifest.json is not found.')
    }
    const manifestJson = JSON.parse(new TextDecoder().decode(fileTree['manifest.json']))
    
    const plugins = [
      ...(opts.plugins || [])
    ]
  
    const compileInit: Parameters<Plugin['onCompile']>[0] = {
      fileTree,
      manifest: manifestJson,
      version: opts.version || 115,
      open (path) {
        return {
          read () {
            return fileTree[path]
          },
          readText () {
            return new TextDecoder().decode(this.read())
          },
          write (data) {
            fileTree[path] = data
          },
          writeText (data) {
            this.write(new TextEncoder().encode(data))
          },
          path,
        }
      },
      regexpWalk (regexp) {
        const result = []
        for (const path of Object.keys(fileTree)) {
          if (regexp.test(path)) {
            result.push(this.open(path))
          }
        }
        return result
      },
      metadata: chromeExtension.getMetadata()
    }
    for (const plugin of plugins) {
      await plugin.onCompile(compileInit)
    }
  
    fileTree['manifest.json'] = new TextEncoder().encode(JSON.stringify(manifestJson, null, 2))
    nextStateFunc({
      state: 'ZIPING'
    })
    const xpiData = zipSync(fileTree as Record<string, Uint8Array>)

    compiledFunc(xpiData)
    nextStateFunc({
      state: 'COMPILED'
    })
  })()

  return {
    compiled,
    stateStream: stateStream
  }
}
