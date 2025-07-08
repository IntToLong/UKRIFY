import {
  SELECTOR_PANEL,
  SELECTOR_TEXT,
  SELECTOR_CHANGE_ICON,
  ICON_SRC_NOTEBOOK,
  SELECTOR_COPY_ICON,
  ICON_SRC_COPY,
  SELECTOR_REPLACE_ICON,
  ICON_SRC_REPLACE,
  SELECTOR_CLOSE_ICON,
  ICON_SRC_CLOSE,
  SELECTOR_ACTIONS,
  SELECTOR_BUTTON,
  SELECTOR_REPLACE_BUTTON,
  SELECTOR_CLOSE_BUTTON,
  SELECTOR_CHANGE_BUTTON,
  SELECTOR_ERROR_MESSAGE,
  SELECTOR_ERROR_ICON,
  ICON_SRC_ERROR,
} from './constants.js';

export function _createUIElements() {
  const panel = document.createElement('div');
  panel.className = SELECTOR_PANEL;
  panel.setAttribute('role', 'dialog');

  const changedText = document.createElement('p');
  changedText.className = SELECTOR_TEXT;

  const changeIcon = document.createElement('img');
  changeIcon.className = SELECTOR_CHANGE_ICON;
  changeIcon.src = ICON_SRC_NOTEBOOK;
  changeIcon.alt = 'Change text icon';

  const copyIcon = document.createElement('img');
  copyIcon.className = SELECTOR_COPY_ICON;
  copyIcon.src = ICON_SRC_COPY;
  copyIcon.alt = 'Copy to clipboard icon';

  const replaceIcon = document.createElement('img');
  replaceIcon.className = SELECTOR_REPLACE_ICON;
  replaceIcon.src = ICON_SRC_REPLACE;
  replaceIcon.alt = 'Replace text icon';

  const closeIcon = document.createElement('img');
  closeIcon.className = SELECTOR_CLOSE_ICON;
  closeIcon.src = ICON_SRC_CLOSE;
  closeIcon.alt = 'Cross icon';

  const errorIcon = document.createElement('img');
  errorIcon.className = SELECTOR_ERROR_ICON;
  errorIcon.src = ICON_SRC_ERROR;
  errorIcon.alt = 'Error circle icon';

  const changeBtn = document.createElement('button');
  changeBtn.className = SELECTOR_CHANGE_BUTTON;
  changeBtn.appendChild(changeIcon);
  changeBtn.setAttribute('aria-label', 'Open text conversion panel');

  const actionsContainer = document.createElement('div');
  actionsContainer.className = SELECTOR_ACTIONS;

  const copyBtn = document.createElement('button');
  const copyButtonName = document.createTextNode('Copy');
  copyBtn.className = SELECTOR_BUTTON;
  copyBtn.appendChild(copyIcon);
  copyBtn.appendChild(copyButtonName);
  actionsContainer.appendChild(copyBtn);

  const replaceBtn = document.createElement('button');
  const replaceButtonName = document.createTextNode('Replace');
  replaceBtn.className = SELECTOR_REPLACE_BUTTON;
  replaceBtn.appendChild(replaceIcon);
  replaceBtn.appendChild(replaceButtonName);
  replaceBtn.setAttribute('aria-label', 'Replace incorrect text');
  replaceBtn.setAttribute('aria-hidden', 'false');
  actionsContainer.appendChild(replaceBtn);

  const closeBtn = document.createElement('button');
  closeBtn.className = SELECTOR_CLOSE_BUTTON;
  closeBtn.appendChild(closeIcon);

  const errorMessage = document.createElement('div');
  errorMessage.className = SELECTOR_ERROR_MESSAGE;
  errorMessage.appendChild(errorIcon);
  ['Unable to insert text.', 'Please click \"Copy\" and paste it manually.'].forEach((el) => {
    let newP = document.createElement('p');
    newP.innerText = el;
    errorMessage.append(newP);
  });

  panel.appendChild(closeBtn);
  panel.appendChild(errorMessage);
  panel.appendChild(changedText);
  panel.appendChild(actionsContainer);
  document.body.appendChild(changeBtn);
  document.body.appendChild(panel);

  //--- Set buttons type to 'button'
  [changeBtn, closeBtn, copyBtn, replaceBtn].forEach((el) => el.setAttribute('type', 'button'));

  // --- Initial State ---
  [panel, changeBtn, errorMessage].forEach((el) => {
    el.classList.add('ukrify-hidden');
    el.setAttribute('aria-hidden', 'true');
  });

  return {
    panel,
    changedText,
    changeIcon,
    copyIcon,
    replaceIcon,
    closeIcon,
    errorMessage,
    copyBtn,
    actionsContainer,
    replaceBtn,
    closeBtn,
    changeBtn,
  };
}

export const uiElements = _createUIElements();
