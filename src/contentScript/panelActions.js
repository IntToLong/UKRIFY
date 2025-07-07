import {
  EN_TO_UA_MAP,
  ICON_SRC_CHECK,
  ICON_SRC_COPY,
  SELECTOR_PANEL,
  SELECTOR_CHANGE_BUTTON,
} from './constants.js';

import { copyToClipboard } from './utils.js';

export function showConversionPanel(event, { uiElements, selectionData }) {
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

  //prevent panel overflow
  const bottomEdge = window.innerHeight - uiElements.panel.offsetHeight;

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
  { uiElements, resetUIAndSelectionState, selectionData },
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

export function handleReplaceClick(event, { uiElements, selectionData, resetUIAndSelectionState }) {
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
  } else {
    selectionData.range.deleteContents();
    selectionData.range.insertNode(document.createTextNode(convertedText));
    selectionData.targetElement?.focus();
    resetUIAndSelectionState({ uiElements, selectionData });
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
