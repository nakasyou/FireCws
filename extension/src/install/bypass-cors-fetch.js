/**
 * @param {string} url
 * @returns {Promise<Blob>}
 */
export default (url) => new Promise((resolve, reject) => {
  window.addEventListener("message", async (evt) => {
    if (evt.data.msg === "crx-data") {
      resolve(evt.data.blob)
    }
  })
  window.postMessage({
    msg: "send-crx",
    url,
  }, "*")  
})
