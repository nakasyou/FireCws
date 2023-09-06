import * as fflate from "fflate"

export default async (zipData: Uint8Array) => {
  const files = fflate.unzipSync(zipData)
  const manifestJson = JSON.parse(new TextDecoder().decode(files["manifest.json"]))
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
  return xpi
}