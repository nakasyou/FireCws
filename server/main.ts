import { Hono } from "hono"
import { Compiler } from '../compiler/mod.ts'

const app = new Hono()

const compiler = new Compiler()

app.get('/x/:ver?', c => {
  const ver = c.req.param('ver') || 'main'
  
  c.header('Content-Type', 'application/typescript')

  return c.body(`export * from 'https://raw.githubusercontent.com/nakasyou/FireCws/${ver}/compiler/mod.ts'`)
})
app.get("/get-xpi/:id", async ctx => {
  const extensionId = ctx.req.param("id")
  const crxUrl = `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromecrx&prodchannel=&prodversion=114.0.5735.248&lang=ja&acceptformat=crx3&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`
  
  const crxBuff = await fetch(crxUrl).then(res => res.arrayBuffer())
  const crxData = new Uint8Array(crxBuff)

  const xpiData = compiler.fromUint8Array(crxData)
    .compile()

  ctx.header("Access-Control-Allow-Origin", "*")
  ctx.header("content-type", "application/x-xpinstall")
  return ctx.body(xpiData)
})
Deno.serve(app.fetch)
