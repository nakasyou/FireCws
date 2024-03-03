import { astPlugin } from "../plugins/ast-plugin";

const result = await Bun.build({
  entrypoints: ['./src/index.ts', './src/default-plugins/main/compile-worker.ts'],
  outdir: './dist',
  plugins: [astPlugin()]
})

if (!result.success) {
  throw result.logs[0]
}