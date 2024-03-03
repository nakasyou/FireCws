import { parse, type ParseResult } from '@babel/parser'
import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as types from '@babel/types'
import * as esbuild from 'esbuild'

export interface CompileJsCodeOpts {
  cwsId: string
}
export interface CompileJsCodeInitData {
  expPath: types.CallExpression
}

const EXTENDS = ['location', 'window', 'globalThis', 'origin']

const makeRandomVarName = () => `f${crypto.randomUUID().replaceAll('-', '')}`

export const compileJsCode = async (
  code: string,
  initData: CompileJsCodeInitData,
  opts: CompileJsCodeOpts
) => {
  const extendVarNameEntries = EXTENDS.map((extend) => [
    extend,
    makeRandomVarName()
  ])
  const extendVarNameMap = Object.fromEntries(extendVarNameEntries)

  const jsonOpts = JSON.stringify(opts, null, 2)
  const createFake = `${generate(initData.expPath).code}(${jsonOpts})`

  const insertingCode = `const {  \n${extendVarNameEntries
    .map(([extend, insertVar]) => `  ${extend}: ${insertVar},`)
    .join('\n')}} = ${createFake}`

  const transformedCode = (
    await esbuild.transform(code, {
      define: extendVarNameMap
    })
  ).code

  const result = transformedCode.startsWith('"use strict";')
    ? transformedCode.replace('"use strict";', `"use strict";\n${insertingCode}`)
    : `${insertingCode}\n${transformedCode}`
  await esbuild.stop()
  return result
}
