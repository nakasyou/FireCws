/// <reference path="../../../plugins/plugin.d.ts" />

import { parse, type ParseResult } from '@babel/parser'
import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as types from '@babel/types'
import * as esbuild from 'esbuild-wasm/lib/browser'

const EXTENDS = ['window', 'globalThis', 'location']

export interface CompileJsCodeOpts {
  cwsId: string
}
export interface CompileJsCodeInitData {
  expPath: types.CallExpression
}
export const compileJsCode = async (
  code: string,
  initData: CompileJsCodeInitData,
  opts: CompileJsCodeOpts
) => {
  /**
   * コードの AST
   */
  const ast = parse(code, {
    sourceType: 'unambiguous'
  })

  const extendsUids: Record<string, string> = {}

  traverse(ast, {
    Program: {
      enter: (path) => {
        for (const extendVar of EXTENDS) {
          const uid = path.scope.generateUid(extendVar)
          extendsUids[extendVar] = uid
        }
      },
      exit: (path) => {
        const polyfillAst = types.variableDeclaration('const', [
          types.variableDeclarator(
            types.objectPattern(
              EXTENDS.map((extendExp) =>
                types.objectProperty(
                  types.identifier(extendExp),
                  types.identifier(extendsUids[extendExp] ?? '')
                )
              )
            ),
            types.callExpression(initData.expPath as types.Expression, [
              types.objectExpression(
                Object.entries(opts).map(([key, value]) =>
                  types.objectProperty(
                    types.stringLiteral(key),
                    types.stringLiteral(value)
                  )
                )
              )
            ])
          )
        ])
        path.node.body.unshift(polyfillAst)
      }
    }
  })

  const output = generate(ast, {}, code)
  await esbuild.stop()

  return output.code
}
