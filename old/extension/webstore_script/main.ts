import { removeRecommendChrome } from "./tasks/remove-recommend-chrome.ts";
//import { urlChangeListener } from "./utils/url-change-listener.ts"
import { injectInstallBtn } from "./tasks/inject-install-btn.ts"

export interface StoreByUrl {
  removedRecommendChrome: boolean
}
setInterval(() => {
  /**
   * この URL の Store
   */
  const thisUrlStore: StoreByUrl = {
    removedRecommendChrome: false
  }

  removeRecommendChrome(thisUrlStore)
  injectInstallBtn()
}, 100)