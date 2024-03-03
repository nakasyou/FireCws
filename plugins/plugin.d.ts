import type { ParseResult } from "@babel/parser"
import type { File } from "@babel/types"

declare module '*?ast' {
  export const code: string
  export const ast: ParseResult<File>
}
