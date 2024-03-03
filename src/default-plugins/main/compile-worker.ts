import { compileJsCode, type CompileJsCodeInitData } from './compile'
import * as esbuild from 'esbuild'

await esbuild.initialize({})

const compileFile = async (
  file: Uint8Array,
  initData: CompileJsCodeInitData,
  options: {
    cwsId: string
  }
) => {
  let result: string
  try {
    result = await compileJsCode(new TextDecoder().decode(file), initData, {
      cwsId: options.cwsId
    })
  } catch (e) {
    return file
  }
  return new TextEncoder().encode(result)
}
globalThis.onmessage = async (e: MessageEvent) => {
  const {
    file,
    initData,
    options
  }: {
    file: Uint8Array
    initData: CompileJsCodeInitData
    options: {
      cwsId: string
    }
  } = e.data

  const compiled = await compileFile(file, initData, options)
  await esbuild.stop()
  postMessage(compiled)
}
