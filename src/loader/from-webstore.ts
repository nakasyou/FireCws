import { CrxExtension } from '../extension'

/**
 * @param extensionId Chrome Webstore ID
 */
export const downloadFromWebStore = async (
  extensionId: string
): Promise<Uint8Array> => {
  const url = `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromecrx&prodchannel=&prodversion=114.0.5735.248&lang=ja&acceptformat=crx3&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

/**
 * @param extensionId Chrome Webstore ID
 */
export const fromWebStore = async (
  extensionId: string
): Promise<CrxExtension> => {
  const data = await downloadFromWebStore(extensionId)

  return new CrxExtension(data, {
    webstoreId: extensionId
  })
}
