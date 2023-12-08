import { emptyDir } from "https://deno.land/std@0.196.0/fs/empty_dir.ts"
import { loadFromChromeWebStore, Compiler, defaultPlugins } from "../compiler/mod.ts"
import { unzipSync } from "fflate"
import { exists } from "https://deno.land/std@0.196.0/fs/exists.ts"
import { join } from "https://deno.land/std@0.201.0/path/mod.ts";

const extId = Deno.args[0]
if (!await exists('./tmp')) {
  await Deno.mkdir('./tmp')
}
if (!await exists('./tmp/tmp-crxs')) {
  await Deno.mkdir('./tmp/tmp-crxs')
}
let crxData: Uint8Array
const crxPath = `./tmp/tmp-crxs/${extId}.crx`
if (await exists(crxPath)) {
  crxData = await Deno.readFile(crxPath)
} else {
  crxData = await loadFromChromeWebStore(extId)
  await Deno.writeFile(crxPath, crxData)
}

console.time('state')
const compiler = new Compiler({
  plugins: [
    ...defaultPlugins()
  ]
})
console.timeLog('state', 'Compiler was created')

const ext = compiler.fromUint8Array(crxData, {
  extensionId: extId
})
console.timeLog('state', 'Loaded Extension')

const compileProcess = ext.compile()
console.timeLog('state', 'Compile Process Started')

for await (const state of compileProcess.stateStream) {
  console.timeLog('state', state.state)
}
console.timeEnd('state')

const xpiData = await compileProcess.compiled

await emptyDir(join('tmp', Deno.args[0]))
for (const [path, data] of Object.entries(unzipSync(xpiData))) {
  const writePath = join('tmp', Deno.args[0], path)
  if (path.at(-1) === '/') {
    await Deno.mkdir(writePath)
  } else {
    await Deno.writeFile(writePath, data)
  }
}
