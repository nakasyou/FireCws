import CRXtoZIP from "../../lib/crx-to-zip.js"

/**
 * @param {Uint8Array} crxData
 * @returns {Promise<Uint8Array>} 
 */
export default (crxData) => new Promise((resolve, reject) => {
  resolve(CRXtoZIP(crxData))
  //CRXtoZIP(crxData, resolve, reject)
})
