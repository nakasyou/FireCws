import type { Output } from 'valibot'
import type { CrxExtension } from '..'
import type { CompileOptions, compileOptionsSchema } from './types'

export type FileTree = {
  [path: string]: Uint8Array
}

export interface CompileDataInit {
  fileTree: FileTree
  options: Output<typeof compileOptionsSchema>
  crx: CrxExtension
}
export type FireCwsFile = Readonly<{
  read(): Uint8Array
  readText(): string
  write(data: Uint8Array): void
  writeText(data: string): void
  path: string
}>
const fireCwsFile = (tree: FileTree, path: string): FireCwsFile => {
  return {
    read() {
      return (
        tree[path] ||
        (() => {
          throw new TypeError('File is not found')
        })()
      )
    },
    readText() {
      return new TextDecoder().decode(this.read())
    },
    write(data) {
      tree[path] = data
    },
    writeText(data) {
      this.write(new TextEncoder().encode(data))
    },
    path
  }
}
export class CompileData {
  #init: CompileDataInit
  #initedData:
    | {
        inited: true
        manifest: unknown
      }
    | {
        inited: false
      }
  readonly options: Output<typeof compileOptionsSchema>
  constructor(init: CompileDataInit) {
    this.#init = init
    this.#initedData = { inited: false }
    this.options = init.options
  }
  async init() {
    const manifestFile = this.open('manifest.json')
    if (!manifestFile) {
      throw new Error("`manifest.json` isn't exists.")
    }
    const manifestJson = JSON.parse(manifestFile.readText())
    this.#initedData = {
      inited: true,
      manifest: manifestJson
    }
  }
  async used() {
    if (!this.#initedData.inited) {
      throw new Error('CompileData is not inited.')
    }
    const manifestJson = JSON.stringify(this.#initedData.manifest, null, 2)
    this.open('manifest.json')?.writeText(manifestJson)
  }
  open(path: string): FireCwsFile | null {
    const fileData = this.#init.fileTree[path]
    return fileData ? fireCwsFile(this.#init.fileTree, path) : null
  }
  regexpWalk(regexp: RegExp): FireCwsFile[] {
    return Object.entries(this.#init.fileTree)
      .filter(([path, _data]) => {
        return regexp.test(path)
      })
      .map(([path, _data]) => fireCwsFile(this.#init.fileTree, path))
  }
  get initedData() {
    if (!this.#initedData.inited) {
      throw new Error('CompileData is not inited.')
    }
    return this.#initedData
  }
  get manifest(): unknown {
    return this.initedData.manifest
  }
  get meta () {
    return this.#init.crx.meta
  }
}
