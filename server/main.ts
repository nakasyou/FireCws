import { Hono } from "hono"
import { Compiler, loadFromChromeWebStore } from '../compiler/mod.ts'
import swServer from './sw-server/hono.tsx'

const app = new Hono()

const compiler = new Compiler()

app.get('/x/:ver?', c => {
  const ver = c.req.param('ver') || 'main'
  
  c.header('Content-Type', 'application/typescript')

  return c.body(`export * from 'https://raw.githubusercontent.com/nakasyou/FireCws/${ver}/compiler/mod.ts'`)
})
app.get("/get-xpi/:id", async ctx => {
  const extensionId = ctx.req.param("id")

  const crxData = await loadFromChromeWebStore(extensionId)

  const xpiData = compiler.fromUint8Array(crxData)
    .compile()

  ctx.header("Access-Control-Allow-Origin", "*")
  ctx.header("content-type", "application/x-xpinstall")
  return ctx.body(xpiData)
})
swServer(app)

Deno.serve(app.fetch)
