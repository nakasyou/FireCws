// きもきもー

import type { CompileJsCodeOpts } from '../compile'

export const polyfillIndexedDB = (opts: CompileJsCodeOpts) => {
  const rawIndexedDB = window.indexedDB

  const getDatabasesStorageData = (): Record<string, number> =>
    JSON.parse(localStorage.getItem('__firecws_indexd_db_databases') ?? '{}')

  const setDatabasesStorageData = (data: Record<string, number>) =>
    localStorage.setItem('__firecws_indexd_db_databases', JSON.stringify(data))
  
  const newIndexedDB = {
    cmp: (first, second) => rawIndexedDB.cmp(first, second),
    open(name, version) {
      const opened = rawIndexedDB.open(name, version)

      const databases = getDatabasesStorageData()
      databases[name] = version ?? 1
      setDatabasesStorageData(databases)

      return opened
    },
    deleteDatabase(name) {
      const deleted = rawIndexedDB.deleteDatabase(name)

      const databases = getDatabasesStorageData()
      delete databases[name]
      setDatabasesStorageData(databases)

      return deleted
    },
    databases() {
      const databases = getDatabasesStorageData()
      const result = Object.entries(databases).map(
        ([name, version]): IDBDatabaseInfo => ({
          name,
          version
        })
      )
      return new Promise((resolve) => {
        resolve(result)
      })
    }
  } satisfies IDBFactory

  Object.defineProperty(window, 'indexedDB', {
    get() {
      return newIndexedDB
    }
  })
}
