/**
 * 
 * @param {InputEvent} evt 
 */
export const install = async (evt) => {
  evt.target.textContent = "追加中..."
  const url = new URL(location.href)
  const extensionId = url.pathname.split("/").at(-1)
  
  const downloadAtag = document.createElement("a")
  downloadAtag.href = `https://firecws.deno.dev/get-xpi/${extensionId}`
  downloadAtag.download = "chrome_extention.xpi"
  
  document.querySelector(".e-f-o").append(downloadAtag)

  downloadAtag.click()
  evt.target.textContent = "ダウンロードしました"
}
/**
 * @param {{
 *  installBtn: HTMLAnchorElement
 * }} param0 
 */
export const pre = async ({ installBtn }) =>{
  console.log("this is pre!!!!!!!!!!")
}
