import { plugin } from 'bun'
import { astPlugin } from './ast-plugin'

await plugin(astPlugin())
