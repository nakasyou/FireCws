import { test } from 'bun:test'
import { compileJsCode } from './compile'
import { initData } from './create-comple-init-data'
import * as esbuild from 'esbuild-wasm'

await esbuild.initialize({
  worker: false
})
const code = `
const location = 0
const a = location.href
`
const compiled = await compileJsCode(code, initData, {
  cwsId: 'aa'
})
console.log(compiled)
