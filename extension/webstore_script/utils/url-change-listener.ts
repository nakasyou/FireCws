export const urlChangeListener = (func: () => void) => {
  /**
   * Last URL
   */
  let oldUrl = ''

  const listener = () => {
    if (oldUrl !== location.href) {
      oldUrl = location.href
      func()
    }
    setTimeout(listener, 100)
  }
  listener()
}
