import { SELECTOR_PANEL, SELECTOR_CHANGE_BUTTON } from './constants'
import { panel, changedText, changeBtn } from './uiElements.js'
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
    event.target.closest(`.${SELECTOR_CHANGE_BUTTON}`)
  ) {
    return
  }

  const selection = window.getSelection()

  //prevent from selection fires if there's no selection or if the selection is a caret
  if (selection.rangeCount === 0) {
    resetUIAndSelectionState()
    return
  }

  selectionData.selectedText = selection.toString()

  if (selectionData.selectedText.trim().length === 0) {
    changeBtn.classList.add('hidden')
    return
  }

  const range = selection.getRangeAt(0)
  selectionData.range = range

  let endNode = range.endContainer
  let offset = range.endOffset

  // find last text node
  if (endNode.nodeType === Node.ELEMENT_NODE) {
    endNode = endNode.childNodes[offset - 1] || endNode
    while (endNode && endNode.lastChild) {
      endNode = endNode.lastChild
    }
    offset = endNode.textContent?.length || 0
  }

  // temporary range for selection end coordinates
  const tempRange = document.createRange()
  tempRange.setStart(endNode, offset)
  tempRange.setEnd(endNode, offset)
  selectionData.rect = tempRange.getBoundingClientRect()

  selectionData.targetElement = event.target

  if (range.anchorNode?.nodeType === Node.TEXT_NODE) {
    selectionData.targetElement = range.anchorNode.parentElement
    if (selectionData.targetElement.closest(`.${SELECTOR_PANEL}`)) {
      return
    }
  }

  if (
    !selectionData.targetElement.closest('input') &&
    !selectionData.targetElement.closest('textarea') &&
    !isContentEditableElement(selectionData.targetElement)
  ) {
    resetUIAndSelectionState()
    return
  }

  //prevent icon overflow
  const bottomEdge = window.innerHeight - changeBtn.offsetHeight

  if (
    selectionData.targetElement.closest('input') ||
    selectionData.targetElement.closest('textarea')
  ) {
    selectionData.rect = selectionData.targetElement.getBoundingClientRect()
    changeBtn.style.left = window.scrollX + selectionData.rect.left + 'px'
  } else {
    changeBtn.style.left =
      window.scrollX + selectionData.rect.left + selectionData.rect.width + 'px'
  }

  changeBtn.style.top =
    selectionData.rect.top + selectionData.rect.height > bottomEdge
      ? window.scrollY + bottomEdge + 'px'
      : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px'

  changedText.innerText = ''
  panel.classList.add('hidden')
  changeBtn.classList.remove('hidden')
  changeBtn.focus()
}

export function resetUIAndSelectionState() {
  changedText.innerText = ''

  panel.classList.add('hidden')
  changeBtn.classList.add('hidden')

  selectionData.selectedText = null
  selectionData.rect = null
  selectionData.range = null
  selectionData.targetElement = null
}
