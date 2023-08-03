import * as _fflate from "../../lib/fflate.js"

/**
 * @type {import("../../lib/fflate.d.ts")}
 */
const fflate = _fflate

/**
 * @param {Blob} zipData
 * @returns {Promise<Blob>}
 */
export default async (zipData) => {
  const zipUint8Array = new Uint8Array(await zipData.arrayBuffer())

  const files = fflate.unzipSync(zipUint8Array)
  const manifestJson = JSON.parse(new TextDecoder().decode(files["manifest.json"]))
  console.log(manifestJson)
  if (!manifestJson.applications) {
    manifestJson.applications = {}
  }
  if (!manifestJson.applications.gecko) {
    manifestJson.applications.gecko = {}
  }
  if (!manifestJson.applications.gecko.id) {
    manifestJson.applications.gecko.id = "example@example.com"
  }
  if (!manifestJson.applications.gecko.strict_min_version) {
    manifestJson.applications.gecko.strict_min_version = "42.0"
  }

  files["manifest.json"] = new TextEncoder().encode(JSON.stringify(manifestJson))

  const xpi = fflate.zipSync(files)
  const xpiBlob = new Blob([xpi], {
    type: "application/x-xpinstall"
  })
  return xpiBlob
}