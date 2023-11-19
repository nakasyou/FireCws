/** @jsx jsx */
/** @jsxFrag Fragment */
import { Hono } from 'hono'
import { jsx, Fragment, html } from 'hono/middleware'

export default (app: Hono) => {
  app.use('/*', async (c, next) => {
    c.header('Access-Control-Allow-Origin', '*')
    await next()
  })
  app.get('/', c => {
    const htmlBody = <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <h1>Server</h1>
        <script src="/script.js"></script>
      </body>
    </html>
    return c.html(html`<!doctype HTML>${htmlBody}`)
  })
  app.get('/script.js', async c => {
    c.header('Content-Type', 'text/javascript')
    return c.body(await Deno.readTextFile(new URL('./script.js', import.meta.url)))
  })
  app.get('/sw.js', async c => {
    c.header('Content-Type', 'text/javascript')
    return c.body(await Deno.readTextFile(new URL('./sw.js', import.meta.url)))
  })
}
