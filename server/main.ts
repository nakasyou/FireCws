import { Hono } from "hono"
import { Compiler, loadFromChromeWebStore, defaultPlugins } from '../compiler/mod.ts'
import swServer from './sw-server/hono.tsx'

const app = new Hono()

const compiler = new Compiler({
  plugins: [...defaultPlugins()]
})

app.get('/x/:ver?', c => {
  const ver = c.req.param('ver') || 'main'
  
  c.header('Content-Type', 'application/typescript')

  return c.body(`export * from 'https://raw.githubusercontent.com/nakasyou/FireCws/${ver}/compiler/mod.ts'`)
})
app.get("/get-xpi/:id", async c => {
  const extensionId = c.req.param("id")

  const crxData = await loadFromChromeWebStore(extensionId)

  const xpiData = await compiler.fromUint8Array(crxData)
    .compile().compiled

  c.header("Access-Control-Allow-Origin", "*")
  c.header("content-type", c.req.query('zip') !== undefined ? 'application/zip' : "application/x-xpinstall")
  return c.body(xpiData)
})
swServer(app)

Deno.serve(app.fetch)
