import * as firecws from '../dist/node'

const id = 'ophjlpahpchlmihnnnihgmmeilfjmjjc'

const crxBunFile = Bun.file(`tmp/${id}.crx`)
let crxData: Uint8Array
if (await crxBunFile.exists()) {
  crxData = new Uint8Array(await crxBunFile.arrayBuffer())
} else {
  crxData = await firecws.downloadFromWebStore(id)
  await Bun.write(`tmp/${id}.crx`, crxData)
}
const crx = await firecws.fromData(crxData, {
  cwsId: id
})

const { xpi, fileTree } = await firecws.compile(crx, {
  esbuildInitializeOptions: {}
}, progres => console.info(firecws.formatProgres(progres)))

await Bun.write(`tmp/${id}.xpi`, xpi)

for (const [path, body] of Object.entries(fileTree)) {
  if ((body ?? new Uint8Array()).length === 0) continue
  await Bun.write(`tmp/${id}/${path}`, body, {
    createPath: true
  })
}
console.log('end')
