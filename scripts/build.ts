import { astPlugin } from '../plugins/ast-plugin'

const build = async (path: string) => {
  const result = await Bun.build({
    entrypoints: [path],
    outdir: './dist',
    plugins: [astPlugin()],
    external: [
      '@babel/types',
      '@babel/generator',
      '@babel/traverse',
      '@babel/types'
    ],
    target: 'browser',
    format: 'esm',
    define: {
      'import.meta.env.PRED': 'true'
    }
  })
  if (!result.success) {
    throw result.logs[0]
  }
}
await Promise.all(
  ['./src/index.ts', './src/default-plugins/main/compile-worker.ts'].map(
    (path) => build(path)
  )
)
