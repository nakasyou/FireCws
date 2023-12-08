import { Plugin } from "../../mod.ts";

import * as esbuild from "https://deno.land/x/esbuild@v0.19.7/mod.js"

const polyfill = `(() => {
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

`

const defineMap: Record<string, string> = {
  "window.location": "window._location",
  "location": "window._location",
  "window.origin": "window._origin",
  "window.open": "window._open"
}
export const transform: Plugin = {
  name: "Transform",
  async onCompile(init) {
    for (const entry of init.regexpWalk(/\.js$/)) {
      const js = entry.readText()
      const transfromed = await esbuild.transform(js, {
        define: defineMap
      })
      entry.writeText(`
      ;(() => {
        window._firecws_extid = "${init.metadata.extensionId || ""}";
      })();
      ` + polyfill + transfromed.code)
    }
  },
}