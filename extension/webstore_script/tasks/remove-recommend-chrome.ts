import type { StoreByUrl } from "../main.ts"

/**
 * Chromeおすすめを削除
 * @param store 
 */
export const removeRecommendChrome = (store: StoreByUrl) => {
  const targetElem = document.querySelectorAll('[aria-labelledby="promo-header"]')[0]
  if (!store.removedRecommendChrome && targetElem) {
    store.removedRecommendChrome = true
    targetElem.remove()
  }
}
