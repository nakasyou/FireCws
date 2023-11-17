import { Plugins } from "./types.ts"

import { baseManifestTransform } from "./base-manifest-transform.ts"

export default {
  baseManifestTransform: {
    plugin: baseManifestTransform,
    enabled: true
  }
} satisfies Plugins
