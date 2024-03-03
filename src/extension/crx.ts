export class CrxExtension {
  #crx: Uint8Array
  #metaData: CrxExtensionMetaData
  constructor(data: Uint8Array, metadata: CrxExtensionMetaData) {
    this.#crx = data
    this.#metaData = metadata
  }
  get crx() {
    return this.#crx
  }
  get meta() {
    return this.#metaData
  }
}
export interface CrxExtensionMetaData {
  cwsId?: string
}
