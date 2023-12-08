import { Plugin } from '../../mod.ts'

const ENABLE_DOCUMENT_POLYFILL = `
;(() => {
  if (!window.document) {
    return
  }
  const oldCreateElement = Document.prototype.createElement
  Document.prototype.createElement = function (...args) {
    const created = oldCreateElement.call(this, ...args)
    if (args[0] === 'iframe') {
      /**
       * @type {HTMLIFrameElement}
       */
      const iframe = created
      iframe.sandbox.add('allow-scripts', 'allow-same-origin')
    }
    return created
  }
})();

`
export const dom: Plugin = {
  name: "dom",
  onCompile(init) {
    for (const js of init.regexpWalk(/\.js$/)) {
      const text = js.readText()
      if (!text) {
        continue
      }
      js.writeText(ENABLE_DOCUMENT_POLYFILL + text)
    }
  },
}