import * as fs from "https://deno.land/std@0.196.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.196.0/path/mod.ts"

import * as esbuild from 'https://deno.land/x/esbuild@v0.19.2/mod.js'
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.2/mod.ts"

export const build = async (isDev: boolean) => {
  const basePath = isDev ? 'dev-dist': 'ext-tmp'

  const manifestJson = JSON.parse(await Deno.readTextFile('./extension/manifest.json'))
  delete manifestJson['$schema']
  await Deno.writeTextFile(`./${basePath}/manifest.json`, JSON.stringify(manifestJson))

  const baseEsbuildConfig = {
    bundle: true,
    plugins: [
      {
        name: 'Type Plugin',
        setup(build) {
          build.onResolve({ filter: /^(npm\:\@types\/firefox-webext-browser)|(npm:@types\/chrome)$/ }, args => ({
            path: args.path,
            namespace: 'empty-ns',
          }))
          build.onLoad({ filter: /.*/, namespace: 'empty-ns' }, () => ({
            loader: 'js',
            contents: ''
          }))
        }
      },
      ...denoPlugins()
    ],
    sourcemap: true,
    external: ['npm:@types/firefox-webext-browser'],
    define: {
      'import.meta.dev': isDev.toString()
    }
  } satisfies esbuild.BuildOptions
  await esbuild.build({
    ...baseEsbuildConfig,
    entryPoints: ['./extension/webstore_script/main.ts'],
    outfile: `./${basePath}/webstore.js`,
  })
  await esbuild.build({
    ...baseEsbuildConfig,
    entryPoints: ['./extension/background/main.ts'],
    outfile: `./${basePath}/background.js`
  })
  
  for await (const entry of fs.walk('./extension/public')) {
    const distPath = path.join('dev-dist', entry.path.replace(/^extension[\\\/]public/, ''))
    if (entry.isDirectory) {
      try {
        await Deno.mkdir(distPath)
      } catch (error) {
        if (!(error instanceof Deno.errors.AlreadyExists)) {
          throw error
        }
      }
    }
    if (!entry.isFile) {
      continue
    }
    await Deno.copyFile(entry.path, distPath)
  }
}

if (import.meta.main) {
  if (Deno.args[0] === 'dev') {
    await fs.emptyDir('./dev-dist')

    await build(true)
    const watcher = Deno.watchFs('./extension', {
      recursive: true
    })
    for await (const _event of watcher) {
      await build(true)
    }
  }
}
