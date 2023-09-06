import crxToZip from "../lib/crx-to-zip.js"

export default (crx: Uint8Array): Uint8Array => {
  return crxToZip(crx)
}