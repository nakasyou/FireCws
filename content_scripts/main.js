const script = document.createElement("script")
script.type = "module"
script.src = chrome.extension.getURL("src/main.js")
document.head.append(script)

window.addEventListener("message", async (evt) => {
  if (evt.data.msg === "send-crx") {
    const blob = await fetch(evt.data.url).then(res=>res.blob())
    window.postMessage({
      msg: "crx-data",
      blob,
    })
  }
})

console.log("mount")
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(chrome.extension.getURL("background/sw.js"))
    .then(function(registration) {
      console.log("Service Worker registered successfully.");
    })
    .catch(function(error) {
      console.error("Service Worker registration failed:", error);
    })
}

