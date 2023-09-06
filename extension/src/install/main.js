import bypassCorsFetch from "./bypass-cors-fetch.js"
import crxToZip from "../utils/crx-to-zip.js"
import zipToXpi from "../utils/zip-to-xpi.js"
import blobToBase64 from "../utils/blob-to-base64.js"

/**
 * 
 * @param {InputEvent} evt 
 */
export const install = async (evt) => {
  evt.target.textContent = "追加中..."
  const url = new URL(location.href)
  const extensionId = url.pathname.split("/").at(-1)
  /*
  const crxUrl = `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromecrx&prodchannel=&prodversion=114.0.5735.248&lang=ja&acceptformat=crx3&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`
  const crxBlob = await bypassCorsFetch(crxUrl)
  const crxUint8Array = new Uint8Array(await crxBlob.arrayBuffer())
  const zipUint8Array = await crxToZip(crxUint8Array)
  const zipBlob = new Blob([zipUint8Array], {
    type: "application/zip"
  })

  const xpiBlob = await zipToXpi(zipBlob)

  const xpiProxyRes = await fetch("https://base64-proxy.deno.dev/post-xpi", {
    method: "POST",
    body: await xpiBlob.arrayBuffer(),
  }).then(res => res.text()) // 反射サーバにアップロード
  console.log(xpiProxyRes)
  */
  const downloadAtag = document.createElement("a")
  downloadAtag.href = `https://webstore-to-xpi.deno.dev/get-xpi/${extensionId}`
  downloadAtag.download = "chrome_extention.xpi"
  //downloadAtag.textContent = "click me!"
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