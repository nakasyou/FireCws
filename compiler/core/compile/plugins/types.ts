export type Plugin = (inp: {
  fileTree: Record<string, Uint8Array | undefined>
  manifest: object
}) => void
export type Plugins = Record<string, {
  plugin: Plugin
  
  enabled: boolean
}>
