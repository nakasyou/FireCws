(() => {
  if (!globalThis.window) {
    return;
  }
  window._location = new Proxy(window.location, {
    get(target, prop) {
      if (target.protocol === "moz-extension:") {
        const url = new URL(target.href);
        url.protocol = "chrome-extension:";
        url.hostname = window._firecws_extid;
        if (prop === "origin") {
          return "chrome-extension://" + window._firecws_extid;
        }
        return url[prop];
      }
      return target[prop];
    },
  });
  const rawWindowOpen = window.open
  window._open = function (...args) {
    console.log(...args)
    return rawWindowOpen(...args)
  }
  try {
    Object.defineProperty(window, "_origin", {
      get() {
        return window._location.origin;
      },
    });
  } catch (err) {}
})();
