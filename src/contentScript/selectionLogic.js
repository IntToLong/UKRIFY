import { SELECTOR_PANEL, SELECTOR_CHANGE_ICON } from './constants'
import { panel, changeIcon, changedText } from './uiElements.js'
import { isContentEditableElement } from './utils.js'

export const selectionData = {
  selectedText: null,
  range: null,
  rect: null,
  targetElement: null,
}

export function handleSelection(event) {
  if (
    event.target.closest(`.${SELECTOR_PANEL}`) ||
    event.target.closest(`.${SELECTOR_CHANGE_ICON}`)
  )
    return

  const selection = window.getSelection()

  //prevent from selection fires if there's no selection or if the selection is a caret
  if (selection.rangeCount === 0) {
    resetUIAndSelectionState()
    return
  }

  selectionData.selectedText = selection.toString()

  if (selectionData.selectedText.trim().length === 0) {
    changeIcon.classList.add('hidden')
    return
  }

  const anchorNode = selection.anchorNode

  selectionData.range = selection?.getRangeAt(0)

  selectionData.rect = selectionData.range.getBoundingClientRect()

  selectionData.targetElement = event.target

  // prevent popup from closing on text selection or double-click.
  if (anchorNode?.nodeType === Node.TEXT_NODE) {
    selectionData.targetElement = anchorNode.parentElement
    if (selectionData.targetElement.closest(`.${SELECTOR_PANEL}`)) {
      return
    }
  }
  //allow extension only on input, textarea, and elements with contentEditable=true
  if (
    !selectionData.targetElement.closest('input') &&
    !selectionData.targetElement.closest('textarea') &&
    !isContentEditableElement(selectionData.targetElement)
  ) {
    resetUIAndSelectionState()
    return
  }

  changedText.innerText = ''
  panel.classList.add('hidden')
  changeIcon.classList.remove('hidden')

  //prevent icon overflow
  const bottomEdge = window.innerHeight - changeIcon.offsetHeight

  if (event.target.closest('input') || event.target.closest('textarea')) {
    selectionData.rect = selectionData.targetElement.getBoundingClientRect()
    changeIcon.style.left = window.scrollX + selectionData.rect.left + 'px'
  } else {
    changeIcon.style.left =
      window.scrollX + selectionData.rect.left + selectionData.rect.width + 'px'
  }

  changeIcon.style.top =
    selectionData.rect.top + selectionData.rect.height > bottomEdge
      ? window.scrollY + bottomEdge + 'px'
      : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px'
}

export function resetUIAndSelectionState() {
  changedText.innerText = ''

  panel.classList.add('hidden')
  changeIcon.classList.add('hidden')

  selectionData.selectedText = null
  selectionData.rect = null
  selectionData.range = null
  selectionData.targetElement = null
}
