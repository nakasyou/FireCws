export const removeDefaultAddChromeBtn = () => {
  const target = document.querySelector(".webstore-test-button-label")
  console.log(target)
  target.parentElement.remove()
}
