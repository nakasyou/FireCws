// @ts-expect-error
import * as rawpolyfill from './polyfill/index.ts?ast'
import traverse from '@babel/traverse'
import * as types from '@babel/types'
import { type ParseResult } from '@babel/parser'
import type { CompileJsCodeInitData } from './compile'

const polyfill = rawpolyfill as unknown as {
  ast: ParseResult<types.File>
}

let defaultExportName = ''

traverse(polyfill.ast, {
  ExportNamedDeclaration: {
    exit (path) {
      path.remove()
    }
  },
  ExportSpecifier: {
    enter (path) {
      if (types.isIdentifier(path.node.exported) && (path.node.exported.name === 'default')) {
        defaultExportName = path.node.local.name
      }
    }
  }
})

const expPath = types.callExpression(types.arrowFunctionExpression([], types.blockStatement([
  ...polyfill.ast.program.body,
  types.returnStatement(types.identifier(defaultExportName))
]), false), [])

export const initData: CompileJsCodeInitData = {
  expPath
}
