export const polyfillDom = () => {
  if (!window.document) {
    return
  }
  const oldCreateElement = Document.prototype.createElement
  Document.prototype.createElement = function (...args: unknown[]) {
    // @ts-expect-error
    const created = oldCreateElement.call(this, ...args)
    if (args[0] === 'iframe') {
      const iframe = created as HTMLIFrameElement
      iframe.sandbox.add('allow-scripts', 'allow-same-origin')
    }
    return created
  }
  Document.prototype.createElement.toString
}