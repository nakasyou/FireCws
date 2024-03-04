import { plugin, type OnLoadResult, type BunPlugin } from 'bun'
import { parse } from '@babel/parser'
import path from 'node:path'
import * as esbuild from 'esbuild'

export const astPlugin = () => ({
  name: 'ast-plugin',
  async setup(build) {
    if (build.config) {
      build.onResolve({ filter: /\?ast$/ }, async (args) => {
        const filePath = path.join(args.importer, '..', args.path)
        return {
          namespace: 'ast',
          path: filePath
        }
      })
    }
    build.onLoad({ filter: /\?ast$/, namespace: build.config ? 'ast' : undefined }, async (args) => {
      const buildResult = await esbuild.build({
        entryPoints: [args.path.replace(/\?ast$/, '')],
        bundle: true,
        write: false,
        format: 'esm'
      })
      if (buildResult.errors.length !== 0) {
        throw buildResult.errors[0]
      }
      const code = buildResult.outputFiles[0]?.text ?? ''
      const ast = parse(code, {
        sourceType: 'unambiguous'
      })
      return {
        loader: 'js',
        contents: `
          export const ast = ${JSON.stringify(ast)}
          export const code = ${JSON.stringify(code)}
        `
      }
    })
  },
}) satisfies BunPlugin
