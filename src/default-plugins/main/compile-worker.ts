import type { Output } from 'valibot'
import { compileJsCode, type CompileJsCodeInitData } from './compile'
import * as esbuild from 'esbuild-wasm'


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
    options,
    esbuildInitializeOptions
  }: {
    file: Uint8Array
    initData: CompileJsCodeInitData
    options: {
      cwsId: string
    }
    esbuildInitializeOptions: esbuild.InitializeOptions
  } = e.data
  await esbuild.initialize(esbuildInitializeOptions)

  const compiled = await compileFile(file, initData, options)
  await esbuild.stop()
  postMessage(compiled)
}
