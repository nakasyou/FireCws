import * as fflate from "https://esm.sh/fflate@0.8.0"
import * as fs from "https://deno.land/std@0.196.0/fs/mod.ts"

const files: Record<string, Uint8Array> = {}
for await (const entry of fs.walk(".")) {
  if (!entry.isFile) {
    continue
  }
  const path = entry.path.replace("\\", "/") // Windows to Linux
  files[path] = await Deno.readFile(entry.path)
}
await fs.emptyDir("./dist")
await Deno.writeFile("./dist/firefox.xpi", fflate.zipSync(files))
