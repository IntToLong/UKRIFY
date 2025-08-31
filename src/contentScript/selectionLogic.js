import { BOTTOM_ELEMENT_OFFSET, SELECTOR_PANEL, SELECTOR_CHANGE_BUTTON } from './constants.js';

export const selectionData = {
  selectedText: null,
  range: null,
  rect: null,
  targetElement: null,
};

export function handleSelection(
  event,
  {
    uiElements,
    selectionData,
    resetUIAndSelectionState,
    isContentEditableElement,
    getHiddenElementHeight,
  },
) {
  if (
    event.target.closest(`.${SELECTOR_PANEL}`) ||
    event.target.closest(`.${SELECTOR_CHANGE_BUTTON}`)
  ) {
    return;
  }

  const selection = window.getSelection();

  //prevent from selection fires if there's no selection or if the selection is a caret
  if (selection.rangeCount === 0) {
    resetUIAndSelectionState({ uiElements, selectionData });
    return;
  }

  selectionData.selectedText = selection.toString();

  if (selectionData.selectedText.trim().length === 0) {
    uiElements.changeBtn.classList.add('ukrify-hidden');
    return;
  }

  const range = selection.getRangeAt(0);
  selectionData.range = range;

  let endNode = range.endContainer;
  let offset = range.endOffset;

  // find last text node
  if (endNode.nodeType === Node.ELEMENT_NODE) {
    endNode = endNode.childNodes[offset - 1] || endNode;
    while (endNode && endNode.lastChild) {
      endNode = endNode.lastChild;
    }
    offset = endNode.textContent?.length || 0;
  }

  // temporary range for selection end coordinates
  const tempRange = document.createRange();
  tempRange.setStart(endNode, offset);
  tempRange.setEnd(endNode, offset);
  selectionData.rect = tempRange.getBoundingClientRect();

  selectionData.targetElement = event.target;

  if (range.anchorNode?.nodeType === Node.TEXT_NODE) {
    selectionData.targetElement = range.anchorNode.parentElement;
    if (selectionData.targetElement.closest(`.${SELECTOR_PANEL}`)) {
      return;
    }
  }

  if (
    !selectionData.targetElement.closest('input') &&
    !selectionData.targetElement.closest('textarea') &&
    !isContentEditableElement(selectionData.targetElement)
  ) {
    resetUIAndSelectionState({ uiElements, selectionData });
    return;
  }

   if (!uiElements.changeIcon.src) {
     uiElements.changeIcon.src = uiElements.changeIcon.dataset.src;
   }

  //prevent icon overflow
  const bottomEdge =
    window.innerHeight - getHiddenElementHeight(uiElements.changeBtn) - BOTTOM_ELEMENT_OFFSET;

  if (
    selectionData.targetElement.closest('input') ||
    selectionData.targetElement.closest('textarea')
  ) {
    selectionData.rect = selectionData.targetElement.getBoundingClientRect();
    uiElements.changeBtn.style.left = window.scrollX + selectionData.rect.left + 'px';
  } else {
    uiElements.changeBtn.style.left =
      window.scrollX + selectionData.rect.left + selectionData.rect.width + 'px';
  }

  uiElements.changeBtn.style.top =
    selectionData.rect.top + selectionData.rect.height > bottomEdge
      ? window.scrollY + bottomEdge + 'px'
      : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px';

  uiElements.changedText.innerText = '';
  uiElements.panel.classList.add('ukrify-hidden');
  uiElements.panel.setAttribute('aria-hidden', 'true');
  uiElements.changeBtn.classList.remove('ukrify-hidden');
  uiElements.changeBtn.setAttribute('aria-hidden', 'false');

  //problem: after calling changeBtn.focus(), the selected text is no longer highlighted
  //changeBtn.focus();
}

export function resetUIAndSelectionState({ uiElements, selectionData }) {
  uiElements.changedText.innerText = '';

  uiElements.panel.classList.add('ukrify-hidden');
  uiElements.panel.setAttribute('aria-hidden', 'true');

  uiElements.changeBtn.classList.add('ukrify-hidden');
  uiElements.changeBtn.setAttribute('aria-hidden', 'true');

  uiElements.replaceBtn.classList.remove('ukrify-hidden');
  uiElements.replaceBtn.setAttribute('aria-hidden', 'false');

  uiElements.errorMessage.classList.add('ukrify-hidden');
  uiElements.errorMessage.setAttribute('aria-hidden', 'true');

  uiElements.changedText.classList.remove('ukrify-hidden');
  uiElements.changedText.setAttribute('aria-hidden', 'false');

  selectionData.selectedText = null;
  selectionData.rect = null;
  selectionData.range = null;
  selectionData.targetElement = null;
}
