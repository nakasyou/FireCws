import * as fflate from "fflate"
import { convertManifest } from "./convert-manifest.ts"

/**
 * Chrome形式の拡張機能を変換する
 */
export default async (zipData: Uint8Array) => {
  const files = fflate.unzipSync(zipData)
  const manifestJson = JSON.parse(new TextDecoder().decode(files["manifest.json"]))

  const newManifest = await convertManifest(manifestJson)
  
  files["manifest.json"] = new TextEncoder().encode(JSON.stringify(newManifest))

  const xpi = fflate.zipSync(files)
  return xpi
}