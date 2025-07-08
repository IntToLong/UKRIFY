const EN_TO_UA_MAP = {
  q: 'й',
  w: 'ц',
  e: 'у',
  r: 'к',
  t: 'е',
  y: 'н',
  u: 'г',
  i: 'ш',
  o: 'щ',
  p: 'з',
  '[': 'х',
  ']': 'ї',

  a: 'ф',
  s: 'і',
  d: 'в',
  f: 'а',
  g: 'п',
  h: 'р',
  j: 'о',
  k: 'л',
  l: 'д',
  ';': 'ж',
  "'": 'є',

  z: 'я',
  x: 'ч',
  c: 'с',
  v: 'м',
  b: 'и',
  n: 'т',
  m: 'ь',
  ',': 'б',
  '.': 'ю',
  '/': '.',

  Q: 'Й',
  W: 'Ц',
  E: 'У',
  R: 'К',
  T: 'Е',
  Y: 'Н',
  U: 'Г',
  I: 'Ш',
  O: 'Щ',
  P: 'З',
  '{': 'Х',
  '}': 'Ї',

  A: 'Ф',
  S: 'І',
  D: 'В',
  F: 'А',
  G: 'П',
  H: 'Р',
  J: 'О',
  K: 'Л',
  L: 'Д',
  ':': 'Ж',
  '"': 'Є',

  Z: 'Я',
  X: 'Ч',
  C: 'С',
  V: 'М',
  B: 'И',
  N: 'Т',
  M: 'Ь',
  '<': 'Б',
  '>': 'Ю',
  '?': ',',
  ' ': ' ',
};

const SELECTOR_PANEL = 'ukrify-popup-panel';
const SELECTOR_TEXT = 'ukrify-popup-text';

const SELECTOR_CHANGE_ICON = 'ukrify-change-icon';
const SELECTOR_COPY_ICON = 'ukrify-copy-icon';
const SELECTOR_CLOSE_ICON = 'ukrify-close-icon';
const SELECTOR_REPLACE_ICON = 'ukrify-replace-icon';
const SELECTOR_ERROR_ICON = 'ukrify-error-icon';

const SELECTOR_ACTIONS = 'ukrify-actions';
const SELECTOR_BUTTON = 'ukrify-button';
const SELECTOR_CLOSE_BUTTON = 'ukrify-close-btn';
const SELECTOR_REPLACE_BUTTON = 'ukrify-replace-btn';
const SELECTOR_CHANGE_BUTTON = 'ukrify-change-btn';
const SELECTOR_ERROR_MESSAGE = 'ukrify-error-message';

const ICON_SRC_NOTEBOOK = chrome.runtime.getURL('img/notebook.svg');
const ICON_SRC_COPY = chrome.runtime.getURL('img/copy.svg');
const ICON_SRC_CHECK = chrome.runtime.getURL('img/check.svg');
const ICON_SRC_REPLACE = chrome.runtime.getURL('img/replace.svg');
const ICON_SRC_CLOSE = chrome.runtime.getURL('img/close.svg');
const ICON_SRC_ERROR = chrome.runtime.getURL('img/error-circle.svg');

export {
  EN_TO_UA_MAP,
  SELECTOR_PANEL,
  SELECTOR_TEXT,
  SELECTOR_CHANGE_ICON,
  SELECTOR_COPY_ICON,
  SELECTOR_CLOSE_ICON,
  SELECTOR_REPLACE_ICON,
  SELECTOR_ERROR_ICON,
  SELECTOR_ACTIONS,
  SELECTOR_BUTTON,
  SELECTOR_CLOSE_BUTTON,
  SELECTOR_REPLACE_BUTTON,
  SELECTOR_CHANGE_BUTTON,
  SELECTOR_ERROR_MESSAGE,
  ICON_SRC_NOTEBOOK,
  ICON_SRC_COPY,
  ICON_SRC_CHECK,
  ICON_SRC_REPLACE,
  ICON_SRC_CLOSE,
  ICON_SRC_ERROR,
};
