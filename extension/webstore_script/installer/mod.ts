import { Compiler, loadFromChromeWebStore } from "../../../compiler/mod.ts"

/**
 * Installer
 * @param evt Click event
 */
export const installer = async (evt: MouseEvent) => {
  const target = evt.currentTarget
  if (!(target instanceof HTMLButtonElement)) {
    throw new Error('Installer event target is not HTMLButtonElement')
  }
  let targetTextElem = target as HTMLSpanElement
  for (const child of Array.from(target.children)) {
    if (child.textContent?.includes('Chrome')) {
      targetTextElem = child as HTMLSpanElement
    }
  }
  const url = new URL(location.href)
  const extensionId = url.pathname.split("/").at(-1) || ''
  
  targetTextElem.textContent = "コンパイルしています..."

  const xpi = new Compiler().fromUint8Array(await loadFromChromeWebStore(extensionId)).compile()
  const xpiBlob = new Blob([xpi], {
    type: 'application/x-xpinstall'
  })
  targetTextElem.textContent = "インストールしています..."

  const reader = new FileReader()
  reader.onload = () => {
    const openUrl = `http://localhost:8000/mirror?xpi=${reader.result}`
    chrome.runtime.sendMessage({
      url: openUrl
    })
  }
  reader.onerror = console.log
  reader.readAsDataURL(xpiBlob)
  console.log('seted reader')

  /*const downloadAtag = document.createElement("a")
  downloadAtag.href = `https://firecws.deno.dev/get-xpi/${extensionId}`
  downloadAtag.download = "chrome_extention.xpi"
  
  document.body.append(downloadAtag)

  targetTextElem.textContent = "ダウンロードしました"*/
}
