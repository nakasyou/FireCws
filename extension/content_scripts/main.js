const script = document.createElement("script")
script.type = "module"
script.src = chrome.extension.getURL("src/main.js")
document.head.append(script)
