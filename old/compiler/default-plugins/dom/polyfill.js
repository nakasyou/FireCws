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
