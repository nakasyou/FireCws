import { Hono } from "hono"
import crxToZip from "./utils/crx-to-zip.ts"
import zipToXpi from "./utils/zip-to-xpi.ts"

const app = new Hono()

app.get("/get-xpi/:id", async ctx => {
  const extensionId = ctx.req.param("id")
  const crxUrl = `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromecrx&prodchannel=&prodversion=114.0.5735.248&lang=ja&acceptformat=crx3&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`
  
  const crxBuff = await fetch(crxUrl).then(res => res.arrayBuffer())
  const crxData = new Uint8Array(crxBuff)

  const zipData = crxToZip(crxData)
  const xpiData = await zipToXpi(zipData)

  ctx.header("Access-Control-Allow-Origin", "*")
  ctx.header("content-type", "application/x-xpinstall")
  return ctx.body(xpiData)
})
Deno.serve(app.fetch)
