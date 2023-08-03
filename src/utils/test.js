import crxToZip from "./crx-to-zip.js";

//const buff = await Deno.readFile(String.raw`C:\Users\syout\Downloads\Z_nhwB7D`)
const blob = await fetch("https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromecrx&prodchannel=&prodversion=114.0.5735.248&lang=ja&acceptformat=crx3&x=id%3Dadbacgifemdbhdkfppmeilbgppmhaobf%26installsource%3Dondemand%26uc").then(res=>res.blob())

const buff = await blob.arrayBuffer()
console.log()
const zip = await crxToZip(new Uint8Array(buff))

console.log(zip)
await Deno.writeFile("aaa.zip", zip)