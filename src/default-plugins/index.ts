import type { Plugin } from '../plugin/types'
import { mainPlugin } from './main'
import { manifestPlugin } from './manifest'

export const defaultPlugins = (): Plugin[] => [manifestPlugin(), mainPlugin()]
