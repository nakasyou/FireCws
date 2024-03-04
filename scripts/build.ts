import { astPlugin } from '../plugins/ast-plugin'
import * as esbuild from 'esbuild-wasm/lib/browser'

const build = async (path: string, browser: boolean) => {
  console.log(path, browser)
  const result = await Bun.build({
    entrypoints: [path],
    outdir: `./dist/${browser ? 'browser' : 'node'}`,
    plugins: [
      astPlugin(),
      {
        name: 'browser',
        setup(build) {
          if (browser) {
            build.onResolve({ filter: /^esbuild-wasm$/ }, async (args) => {
              const libPath = await import.meta.resolve('../node_modules/esbuild-wasm/lib/browser')
              return {
                path: libPath,
                namespace: 'file'
              }
            })
          }
        },
      }
    ],
    external: [
      '@babel/types',
      '@babel/generator',
      '@babel/traverse',
      '@babel/types'
    ],
    format: 'esm',
    define: {
      'import.meta.env.PRED': 'true'
    },
    target: browser ? 'browser' : 'bun'
  })

  if (!result.success) {
    throw result.logs[0]
  }
}
await Promise.all(
  ['./src/index.ts', './src/default-plugins/main/compile-worker.ts'].map(
    (path) => {
      build(path, true)
      build(path, false)
    }
  )
)
