import { Compiler, loadFromChromeWebStore } from "../../compiler/mod.ts"

//import 'npm:@types/firefox-webext-browser'
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const headers = details.responseHeaders || []
    for (const header of headers) {
      if (header.name.toLowerCase() === 'content-type') {
        header.value = 'application/x-xpinstalla'
      }
    }
    console.log(headers)
    return { responseHeaders: headers }
  },
  { urls: ["https://firecws.nakasyou.github.io/*"] },
  ["blocking", "responseHeaders"]
)
chrome.webRequest.onBeforeRequest.addListener(
  (requestEvent) => {
    const filter = browser.webRequest.filterResponseData(requestEvent.requestId)
    const requestUrl: URL = new URL(requestEvent.url)

    filter.ondata = (_event) => {

    }
    filter.onstart = (event) => {
      console.log(event)
      ;(async () => {
        if (requestUrl.pathname === '/cws') {
          const cwsId = requestUrl.searchParams.get('id') || ''
          const cwsData = await loadFromChromeWebStore(cwsId)
          const crxExtension = new Compiler().fromUint8Array(cwsData)
          const xpiData = crxExtension.compile()
          filter.write(xpiData)
          console.log('writed')
          filter.close()
        }
        filter.close()
      })().catch(console.error)
    }
    //filter.onstop = (_event) => {
      
    //}

    return {};
  },
  {
    urls: ["https://firecws.nakasyou.github.io/*"],
    //, types: ['main_frame', 'script', 'sub_frame', 'xmlhttprequest', 'other'] // optional
  },
  ["blocking"]
)
