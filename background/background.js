chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  fetch(message)
    .then(res => {
      sendResponse(res)
    })
  return true;
})

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    return {
      cancel: false
    };
  },
  { urls: ["*://*._webstore_on_firefox.com/*"] },
  ["blocking"]
)

