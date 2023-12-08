interface Window {
  _firecws_indexed_db_databases_polyfill?: {
    databases: {
      name: string
      version: number
    }[]
    onUpdate (): void
  }
}
