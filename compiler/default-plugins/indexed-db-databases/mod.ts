import type { Plugin } from "../../core/compile/mod.ts"

/**
 * window.indexedDB.databases のポリフィルコード
 * ./polyfill.js
 */
const INDEXED_DB_POLYFILL = `;(() => {
  if (window._firecws_indexed_db_databases_polyfill) {
    return
  }
  const oldIndexedDB = window.indexedDB

  const databasesStorageData = localStorage.getItem('firecws_indexd_db_databases')

  window._firecws_indexed_db_databases_polyfill = {
    databases: databasesStorageData ? JSON.parse(databasesStorageData) : [],
    onUpdate () {
      localStorage.setItem('firecws_indexd_db_databases', JSON.stringify(this.databases))
    }
  }
  const store = window._firecws_indexed_db_databases_polyfill
  store.onUpdate()
  /**
   * @type {IDBFactory}
   */
  const newIndexedDB = {
    cmp: (first, second) => oldIndexedDB.cmp(first, second),
    open (name, version) {
      console.log('open', name, version)
      let existsDataBase = false
      for (const database of store.databases) {
        if (database.name == name) {
          // データベースが存在する
          existsDataBase = true
          break
        }
      }
      if (!existsDataBase) {
        // データベースが存在しないなら
        store.databases.push({
          name,
          version: version || 1
        })
        store.onUpdate()
      }
      return oldIndexedDB.open(name, version)
    },
    deleteDatabase (name) {
      store.databases = store.databases.filter(database => database.name !== name)
      store.onUpdate()
      return oldIndexedDB.deleteDatabase(name)
    },
    databases() {
      console.log('databases')

      return new Promise(resolve => {
        resolve(store.databases)
      })
    },
  }
  Object.defineProperty(window, 'indexedDB', {
    get() {
      return newIndexedDB
    },
  })
})();`

export const indexedDBDatabases: Plugin = {
  name: 'indexed-db-databases',
  onCompile(init) {
    for (const js of init.regexpWalk(/\.js$/)) {
      const text = js.readText()
      if (!text) {
        continue
      }
      js.writeText(INDEXED_DB_POLYFILL + text)
    }
  },
}
