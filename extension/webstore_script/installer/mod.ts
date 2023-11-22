import 'npm:@types/chrome'
import 'npm:@types/firefox-webext-browser'

/**
 * Installer
 * @param evt Click event
 */
export const installer = (evt: MouseEvent) => {
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

  const downloadAtag = document.createElement("a")
  downloadAtag.href = `${import.meta.dev ? 'http://localhost:8000' : 'https://firecws.deno.dev'}/get-xpi/${extensionId}`
  downloadAtag.download = "chrome_extention.xpi"
  
  document.body.append(downloadAtag)
  downloadAtag.click()

  targetTextElem.textContent = "ダウンロードをリクエストしました"
}
