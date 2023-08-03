export const addInstallBtn = () => {
  const container = document.getElementsByClassName("e-f-o")[0]

  const btn = document.createElement("div")
  btn.innerHTML = `<div role="button" class="dd-Va g-c-wb g-eg-ua-Uc-c-za g-c-Oc-td-jb-oa g-c" aria-label="Chrome に追加" style="user-select: none;" tabindex="0"><div class="g-c-Hf"><div class="g-c-x"><div class="g-c-R  webstore-test-button-label">Firefox に追加</div></div></div></div>`
  btn.addEventListener("pointerover", () => {
    btn.children[0].className += " g-c-l"
  })
  btn.addEventListener("pointerout", () => {
    btn.children[0].className = btn.children[0].className.replace("g-c-l", "")
  })
  container.append(btn)
  return btn
}
