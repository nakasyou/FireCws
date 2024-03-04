import type { Plugin } from '../../plugin'
import type { CompileJsCodeOpts } from './compile'
import { initData } from './create-comple-init-data'
import type { FireCwsFile } from '../../compiler/compile-data'

export const mainPlugin = (): Plugin => ({
  name: 'main',
  task: async (compileData, log) => {
    const files = compileData.regexpWalk(/\.m?js$/)

    const fileLength = files.length
    const fileLengthDecLength = fileLength.toString().length
    log(`js compile: found ${fileLength} js file`)

    const workerPath = import.meta.env.PRED ? './compile-worker.js' : './compile-worker.ts'
    const selializedCompileWorker = JSON.parse(JSON.stringify(initData))
    const compileWorkerUrl = new URL(workerPath, import.meta.url).href

    let finishedIndex = 0
    const compileOneFile = (file: FireCwsFile, i: number) =>
      new Promise<Uint8Array>((resolve) => {
        const finished = (data: Uint8Array) => {
          finishedIndex ++
          log(`Worker finished: ${finishedIndex.toString().padStart(fileLengthDecLength, ' ')}/${fileLength} (${file.path})`)
          resolve(data)
        }
        const data = file.read()
        const compileWorker = new Worker(compileWorkerUrl, {
          type: 'module'
        })
        log(`Worker started: ${(i+1).toString().padStart(fileLengthDecLength, ' ')}/${fileLength} (${file.path})`)
        compileWorker.onerror = (err) => {
          finished(data)
          throw err.message
        }

        compileWorker.postMessage({
          file: data,
          initData: selializedCompileWorker,
          options: ({
            cwsId: compileData.meta.cwsId ?? crypto.randomUUID()
          } satisfies CompileJsCodeOpts),
          esbuildInitializeOptions: compileData.options.esbuildInitializeOptions
        })

        compileWorker.onmessage = (e) => {
          compileWorker.terminate()
          finished(e.data)
        }
      })

    const resultPromise = await Promise.all(
      files.map((file, i) => compileOneFile(file, i))
    )

    const result = resultPromise

    for (const [i, resultFile] of Object.entries(result)) {
      files[parseInt(i)]?.write(resultFile)
    }
  }
})
