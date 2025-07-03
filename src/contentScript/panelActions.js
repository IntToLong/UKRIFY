import {
  EN_TO_UA_MAP,
  ICON_SRC_CHECK,
  ICON_SRC_COPY,
  SELECTOR_PANEL,
  SELECTOR_CHANGE_ICON,
} from './constants.js'
import { changedText, copyIcon, panel, changeIcon, replaceBtn } from './uiElements.js'
import { selectionData, handleSelection, resetUIAndSelectionState } from './selectionLogic.js'

export async function handleCopyClick(event) {
  event.stopPropagation()

  let text = changedText.innerText
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    console.log('Content copied to clipboard')
    copyIcon.src = ICON_SRC_CHECK

    setTimeout(() => {
      copyIcon.src = ICON_SRC_COPY
      resetUIAndSelectionState()
    }, 500)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

export function handleReplaceClick(event) {
  event.stopPropagation()
  const convertedText = changedText.innerText
  if (
    selectionData.targetElement.tagName === 'INPUT' ||
    selectionData.targetElement.tagName === 'TEXTAREA'
  ) {
    const start = selectionData.targetElement.selectionStart
    const end = selectionData.targetElement.selectionEnd

    selectionData.targetElement.setRangeText(convertedText, start, end, 'end')
    selectionData.targetElement.focus()
  } else {
    selectionData.range.deleteContents()
    selectionData.range.insertNode(document.createTextNode(convertedText))
  }
  window.getSelection().removeAllRanges()
  resetUIAndSelectionState()
}

export function handleDocumentClick(event) {
  const selectionLength = window.getSelection().toString().length
  const isInsidePanel = !!event.target.closest(`.${SELECTOR_PANEL}`)
  const isInsideChangeIcon = !!event.target.closest(`.${SELECTOR_CHANGE_ICON}`)
  const isChangeIconDisplayed = !changeIcon.classList.contains('hidden')
  const isPanelDisplayed = !panel.classList.contains('hidden')

  if (
    (isPanelDisplayed || isChangeIconDisplayed) &&
    !isInsidePanel &&
    !isInsideChangeIcon &&
    selectionLength === 0
  ) {
    resetUIAndSelectionState()
  }
}

export function handleInputDeleting(event) {
  const key = event.key

  if (event.code == 'KeyA' && (event.ctrlKey || event.metaKey)) {
    //JS magic: wait until browser applies selection (Ctrl+A), then read it
    setTimeout(() => handleSelection(event), 0)
  }

  if (
    key === 'Delete' ||
    key === 'Backspace' ||
    (event.code == 'KeyV' && (event.ctrlKey || event.metaKey))
  ) {
    resetUIAndSelectionState()
  }
}

export function showConversionPanel(event) {
  event.stopPropagation()

  let arrFromSelection = selectionData.selectedText.trim().split('')
  let convertedText = arrFromSelection.map((el) => EN_TO_UA_MAP[el] || el).join('')
  changedText.innerText = convertedText

  changeIcon.classList.add('hidden')

  if (changedText.innerText.trim().length > 0) {
    panel.classList.remove('hidden')
  } else {
    panel.classList.add('hidden')
  }

  //prevent "The input element's type ('email') does not support selection" error
  if (selectionData.targetElement.type === 'email') {
    replaceBtn.classList.add('hidden')
  } else {
    replaceBtn.classList.remove('hidden')
  }

  //prevent panel overflow
  const bottomEdge = window.innerHeight - panel.offsetHeight
  //const bottomEdge = selectionData.rect.top - panel.offsetHeight - selectionData.rect.height
  panel.style.top =
    selectionData.rect.top + selectionData.rect.height >= bottomEdge
      ? // ? window.scrollY + bottomEdge + 'px'
        window.scrollY +
        selectionData.rect.top -
        panel.offsetHeight -
        selectionData.rect.height +
        'px'
      : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px'

  panel.style.left = window.scrollX + selectionData.rect.left + 'px'
}
