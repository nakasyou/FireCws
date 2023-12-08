import { Compiler, loadFromChromeWebStore } from "../../compiler/mod.ts"

//import 'npm:@types/firefox-webext-browser'
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const headers = details.responseHeaders || []

    console.log(headers)
    return { responseHeaders: headers }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
)
