/**
 * load from chrome web store
 * @param extensionId Chrome Webstore Extension ID
 */
export const loadFromChromeWebStore = async (extensionId: string): Promise<Uint8Array> => {
  const url = `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromecrx&prodchannel=&prodversion=114.0.5735.248&lang=ja&acceptformat=crx3&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}
