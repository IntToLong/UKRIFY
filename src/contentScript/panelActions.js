import {
  EN_TO_UA_MAP,
  BOTTOM_ELEMENT_OFFSET,
  ICON_SRC_CHECK,
  ICON_SRC_COPY,
  SELECTOR_PANEL,
  SELECTOR_CHANGE_BUTTON,
} from './constants.js';

export function showConversionPanel(event, { uiElements, selectionData, getHiddenElementHeight }) {
  event.stopPropagation();

  const selectedText = selectionData.selectedText.trim();
  if (selectedText === 0) {
    return;
  }

  let arrFromSelection = selectedText.split('');
  let convertedText = arrFromSelection.map((el) => EN_TO_UA_MAP[el] || el).join('');
  uiElements.changedText.innerText = convertedText;

  uiElements.changeBtn.classList.add('ukrify-hidden');
  uiElements.changeBtn.setAttribute('aria-hidden', 'true');

  if (uiElements.changedText.innerText.trim().length > 0) {
    uiElements.panel.classList.remove('ukrify-hidden');
    uiElements.panel.setAttribute('aria-hidden', 'false');
  } else {
    uiElements.panel.classList.add('ukrify-hidden');
    uiElements.panel.setAttribute('aria-hidden', 'true');
  }

  //prevent "The input element's type ('email') does not support selection" error
  if (selectionData.targetElement.type === 'email') {
    uiElements.replaceBtn.classList.add('ukrify-hidden');
    uiElements.replaceBtn.setAttribute('aria-hidden', 'true');
  } else {
    uiElements.replaceBtn.classList.remove('ukrify-hidden');
    uiElements.replaceBtn.setAttribute('aria-hidden', 'false');
  }

  if (!uiElements.copyIcon.src) {
    uiElements.copyIcon.src = uiElements.copyIcon.dataset.src;
  }
  if (!uiElements.replaceIcon.src) {
    uiElements.replaceIcon.src = uiElements.replaceIcon.dataset.src;
  }
  if (!uiElements.closeIcon.src) {
    uiElements.closeIcon.src = uiElements.closeIcon.dataset.src;
  }

  //prevent panel overflow
  const bottomEdge =
    window.innerHeight - getHiddenElementHeight(uiElements.panel) - BOTTOM_ELEMENT_OFFSET;

  uiElements.panel.style.top =
    selectionData.rect.top + selectionData.rect.height >= bottomEdge
      ? window.scrollY +
        selectionData.rect.top -
        uiElements.panel.offsetHeight -
        selectionData.rect.height +
        'px'
      : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px';

  uiElements.panel.style.left = window.scrollX + selectionData.rect.left + 'px';
}

export async function handleCopyClick(
  event,
  { uiElements, resetUIAndSelectionState, selectionData, copyToClipboard },
) {
  event.stopPropagation();

  let text = uiElements.changedText.innerText;
  if (!text) return;

  try {
    await copyToClipboard(text);
    console.log('Content copied to clipboard');
    uiElements.copyIcon.src = ICON_SRC_CHECK;

    setTimeout(() => {
      uiElements.copyIcon.src = ICON_SRC_COPY;
      resetUIAndSelectionState({ uiElements, selectionData });
    }, 500);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

export async function handleReplaceClick(
  event,
  { uiElements, selectionData, resetUIAndSelectionState },
) {
  event.stopPropagation();
  const convertedText = uiElements.changedText.innerText;
  if (
    selectionData.targetElement.tagName === 'INPUT' ||
    selectionData.targetElement.tagName === 'TEXTAREA'
  ) {
    const start = selectionData.targetElement.selectionStart;
    const end = selectionData.targetElement.selectionEnd;

    selectionData.targetElement.setRangeText(convertedText, start, end, 'end');
    selectionData.targetElement.focus();
    resetUIAndSelectionState({ uiElements, selectionData });
  } else {
    selectionData.range.deleteContents();
    selectionData.range.insertNode(document.createTextNode(convertedText));

    //reposition cursor after selection
    let endNode = selectionData.range.endContainer;
    let offset = selectionData.range.endOffset;
    const newRange = document.createRange();
    newRange.setStart(endNode, offset);
    newRange.collapse(true);
    window.getSelection().removeAllRanges();
    document.getSelection().addRange(newRange);

    //repaint DOM
    await new Promise((resolve) => requestAnimationFrame(resolve));

    let isTextInDocument = false;

    let containerToCheck = selectionData.range.commonAncestorContainer;

    if (containerToCheck && containerToCheck.nodeType === Node.TEXT_NODE) {
      containerToCheck = containerToCheck.parentNode;
    }

    isTextInDocument = containerToCheck.innerText?.includes(convertedText);

    if (!isTextInDocument) {
      uiElements.replaceBtn.classList.add('ukrify-hidden');
      uiElements.replaceBtn.setAttribute('aria-hidden', 'true');

      uiElements.changedText.classList.add('ukrify-hidden');
      uiElements.changedText.setAttribute('aria-hidden', 'true');

      if (!uiElements.errorIcon.src) {
        uiElements.errorIcon.src = uiElements.errorIcon.dataset.src;
      }
      
      uiElements.errorMessage.classList.remove('ukrify-hidden');
      uiElements.errorMessage.setAttribute('aria-hidden', 'false');

      uiElements.copyBtn.focus();
    } else {
      resetUIAndSelectionState({ uiElements, selectionData });
    }
  }
}

export function handleDocumentClick(
  event,
  { uiElements, selectionData, resetUIAndSelectionState },
) {
  const selectionLength = window.getSelection().toString().length;
  const isInsidePanel = !!event.target.closest(`.${SELECTOR_PANEL}`);
  const isInsideChangeBtn = !!event.target.closest(`.${SELECTOR_CHANGE_BUTTON}`);
  const isChangeBtnDisplayed = !uiElements.changeBtn.classList.contains('ukrify-hidden');
  const isPanelDisplayed = !uiElements.panel.classList.contains('ukrify-hidden');

  if (
    (isPanelDisplayed || isChangeBtnDisplayed) &&
    !isInsidePanel &&
    !isInsideChangeBtn &&
    selectionLength === 0
  ) {
    resetUIAndSelectionState({ uiElements, selectionData });
  }
}

export function handleTyping(
  event,
  {
    uiElements,
    selectionData,
    handleSelection,
    resetUIAndSelectionState,
    isContentEditableElement,
    getHiddenElementHeight,
  },
) {
  if (event.code == 'KeyA' && (event.ctrlKey || event.metaKey)) {
    //wait until browser applies selection (Ctrl+A), then read it
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // runs *after* the next repaint
        handleSelection(event, {
          uiElements,
          selectionData,
          resetUIAndSelectionState,
          isContentEditableElement,
          getHiddenElementHeight,
        });
      });
    });

    return;
  }

  //show panel on Enter type
  const isChangeBtnDisplayed = !uiElements.changeBtn.classList.contains('ukrify-hidden');

  if (isChangeBtnDisplayed && event.code === 'Enter') {
    showConversionPanel(event, { uiElements, selectionData });
  }

  //fix case when user Ctrl+A and after keep typing
  if (event.code && event.code !== 'Enter' && event.code !== 'Tab') {
    resetUIAndSelectionState({ uiElements, selectionData });
  }
}
