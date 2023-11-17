export const removeRecommendChrome = (store) => {
  const targetElem = document.querySelectorAll('[aria-labelledby="promo-header"]')[0]

  if (!store.removedRecommendChrome && targetElem) {
    store.removedRecommendChrome = true
    targetElem.remove()
  }
}
