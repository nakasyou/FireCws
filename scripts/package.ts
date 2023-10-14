import * as fflate from "https://esm.sh/fflate@0.8.0"
import * as fs from "https://deno.land/std@0.196.0/fs/mod.ts"

const version = Deno.args[0]

const manifest = JSON.parse(await Deno.readTextFile('./extension/manifest.json'))
manifest.version = version
await Deno.writeTextFile('./extension/manifest.json', JSON.stringify(manifest, null, 2))

const files: Record<string, Uint8Array> = {}
for await (const entry of fs.walk("./extension")) {
  if (!entry.isFile) {
    continue
  }
  const path = entry.path.replace("\\", "/") // Windows to Linux
    .replace(/^extension\//, '') // サブディレクトリ`extension`をルートに
  files[path] = await Deno.readFile(entry.path)
}
console.log(files)
await fs.emptyDir("./dist")
await Deno.writeFile("./dist/firefox.xpi", fflate.zipSync(files))
