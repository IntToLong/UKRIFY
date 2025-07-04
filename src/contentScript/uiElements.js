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
} from './constants.js';

export function _createUIElements() {
  const panel = document.createElement('div');
  panel.className = SELECTOR_PANEL;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-hidden', 'true');

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

  const changeBtn = document.createElement('button');
  changeBtn.className = SELECTOR_CHANGE_BUTTON;
  changeBtn.appendChild(changeIcon);
  changeBtn.setAttribute('aria-label', 'Open text conversion panel'); 
  changeBtn.setAttribute('aria-hidden', 'true');

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
  replaceBtn.className = SELECTOR_BUTTON;
  replaceBtn.classList.add(SELECTOR_REPLACE_BUTTON);
  replaceBtn.appendChild(replaceIcon);
  replaceBtn.appendChild(replaceButtonName);
  actionsContainer.appendChild(replaceBtn);

  const closeBtn = document.createElement('button');
  closeBtn.className = SELECTOR_CLOSE_BUTTON;
  closeBtn.appendChild(closeIcon);

  panel.appendChild(closeBtn);
  panel.appendChild(changedText);
  panel.appendChild(actionsContainer);
  document.body.appendChild(changeBtn);
  document.body.appendChild(panel);

  //--- Set buttons type to 'button'
  [changeBtn, closeBtn, copyBtn, replaceBtn].map((el) => el.setAttribute('type', 'button'));

  // --- Initial State ---
  panel.classList.add('hidden');
  changeBtn.classList.add('hidden');

  return {
    panel,
    changedText,
    changeIcon,
    copyIcon,
    replaceIcon,
    closeIcon,
    copyBtn,
    replaceBtn,
    closeBtn,
    changeBtn,
  };
}

export const {
  panel,
  changedText,
  changeIcon,
  copyIcon,
  replaceIcon,
  closeIcon,
  copyBtn,
  replaceBtn,
  closeBtn,
  changeBtn,
} = _createUIElements();
