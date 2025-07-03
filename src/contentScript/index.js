import { changeIcon, copyBtn, replaceBtn, closeBtn } from './uiElements.js'

import { handleSelection, resetUIAndSelectionState } from './selectionLogic.js'

import {
  showConversionPanel,
  handleCopyClick,
  handleReplaceClick,
  handleDocumentClick,
  handleInputDeleting,
} from './panelActions'

import './styles.css'

// --- Event Handlers ---
// used 'mouseup' on changeIcon instead of 'click' event to ensure proper functionality within Gmail's "New Message" iframe.
changeIcon.addEventListener('mouseup', showConversionPanel)
copyBtn.addEventListener('click', handleCopyClick)
replaceBtn.addEventListener('click', handleReplaceClick)
closeBtn.addEventListener('click', resetUIAndSelectionState)

document.addEventListener('dblclick', handleSelection)
document.addEventListener('mouseup', handleSelection)
document.addEventListener('click', handleDocumentClick)
document.addEventListener('keydown', handleInputDeleting)
