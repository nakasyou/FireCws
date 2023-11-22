import { installer } from "../installer/mod.ts"

export const injectInstallBtn = () => {
  const addChrome = document.querySelector(`button[jscontroller][jsaction][aria-describedby="i5"]`)
  if (!addChrome) {
    return
  }
  if (!(addChrome instanceof HTMLButtonElement)) {
    throw new Error('Install Button is not HTMLButtonElement')
  }
  if (addChrome) {
    addChrome.disabled = false
    addChrome.onclick = installer
  }
}
