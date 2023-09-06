// Main code
import { waitWebstoreLoaded } from "./steps/wait-webstore-loaded.js"
import { removeDefaultAddChromeBtn } from "./steps/remove-default-add-chrome-btn.js"
import { addInstallBtn } from "./steps/add-install-btn.js"
import { removeRecommendChrome } from "./steps/remove-recommend-chrome.js"
import { install, pre } from "./install/main.js"


let oldUrl = ""
/**
 * 
 * @param {() => void} func 
 */
const urlChangeListener = (func) => {
  if (oldUrl !== location.href) {
    oldUrl = location.href
    func()
  }
  setTimeout(urlChangeListener, 100, func)
}

urlChangeListener(async () => {
  await waitWebstoreLoaded()
  removeRecommendChrome()
  removeDefaultAddChromeBtn()

  const installBtn = addInstallBtn()
  pre({
    installBtn
  })
  installBtn.addEventListener("click", install)
})

