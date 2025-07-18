import { uiElements } from './uiElements.js';

import { isContentEditableElement, getHiddenElementHeight, copyToClipboard } from './utils.js';

import { handleSelection, resetUIAndSelectionState, selectionData } from './selectionLogic.js';

import {
  showConversionPanel,
  handleCopyClick,
  handleReplaceClick,
  handleDocumentClick,
  handleTyping,
} from './panelActions';

import './styles.css';

// --- Event Handlers ---
// used 'mouseup' on changeIcon instead of 'click' event to ensure proper functionality within Gmail's "New Message" iframe.
uiElements.changeBtn.addEventListener('mouseup', (event) =>
  showConversionPanel(event, { uiElements, selectionData, getHiddenElementHeight }),
);
uiElements.copyBtn.addEventListener('click', (event) =>
  handleCopyClick(event, { uiElements, resetUIAndSelectionState, selectionData, copyToClipboard }),
);
uiElements.replaceBtn.addEventListener('click', (event) =>
  handleReplaceClick(event, {uiElements, selectionData, resetUIAndSelectionState }),
);
uiElements.closeBtn.addEventListener('click', () =>
  resetUIAndSelectionState({ uiElements, selectionData }),
);

document.addEventListener('dblclick', (event) =>
  handleSelection(event, {
    uiElements,
    selectionData,
    resetUIAndSelectionState,
    isContentEditableElement,
    getHiddenElementHeight,
  }),
);
document.addEventListener('mouseup', (event) =>
  handleSelection(event, {
    uiElements,
    selectionData,
    resetUIAndSelectionState,
    isContentEditableElement,
    getHiddenElementHeight,
  }),
);
document.addEventListener('click', (event) =>
  handleDocumentClick(event, { uiElements, selectionData, resetUIAndSelectionState }),
);
document.addEventListener('keydown', (event) =>
  handleTyping(event, {
    uiElements,
    selectionData,
    handleSelection,
    resetUIAndSelectionState,
    isContentEditableElement,
    getHiddenElementHeight,
  }),
);
