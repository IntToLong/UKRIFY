import './contentStyles.css'

console.log('contentScript is running')
//alert('double')
(function () {
  //--- Constants ---
  const enToUaMap = {
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
  }

  const SELECTOR_PANEL = 'popup-panel'
  const SELECTOR_TEXT = 'popup-text'
  const SELECTOR_CHANGE_ICON = 'change-icon'
  const SELECTOR_COPY_ICON = 'copy-icon'

  const ICON_SRC_NOTEBOOK = chrome.runtime.getURL('img/notebook.png')
  const ICON_SRC_COPY = chrome.runtime.getURL('img/copy.svg')
  const ICON_SRC_CHECK = chrome.runtime.getURL('img/check.svg')

  let uaWord = ''

  // --- DOM Elements Creation ---
  const panel = document.createElement('div')
  panel.className = SELECTOR_PANEL

  const changedText = document.createElement('p')
  changedText.className = SELECTOR_TEXT

  const changeIcon = document.createElement('img')
  changeIcon.className = SELECTOR_CHANGE_ICON
  changeIcon.src = ICON_SRC_NOTEBOOK
  changeIcon.alt = 'Change text icon'

  const copyIcon = document.createElement('img')
  copyIcon.className = SELECTOR_COPY_ICON
  copyIcon.src = ICON_SRC_COPY
  copyIcon.alt = 'Copy to clipboard icon'

  panel.appendChild(changedText)
  panel.appendChild(copyIcon)
  document.body.appendChild(changeIcon)
  document.body.appendChild(panel)

  // --- Initial State ---
  panel.classList.add('hidden')
  changeIcon.classList.add('hidden')

  // --- Functions ---
  function handleEnToUa(event) {
    console.log('image click')
    event.stopPropagation()

    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    const range = selection?.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    let arrFromSelection = selection.toString().trim().split('')
    uaWord = arrFromSelection.map((el) => enToUaMap[el] || el).join('')
    changedText.innerText = uaWord

    changeIcon.classList.add('hidden')

    
    if (changedText.innerText.trim().length > 0) {
      panel.classList.remove('hidden')
    }

    //prevent panel overflow
    const bottomEdge = window.innerHeight - panel.offsetHeight
    panel.style.top =
      rect.top + rect.height >= bottomEdge
        ? window.scrollY + bottomEdge + 'px'
        : window.scrollY + rect.top + rect.height + 'px'

    panel.style.left = window.scrollX + rect.left + 'px'
  }

  async function handleCopyClick(event) {
    event.stopPropagation()
    console.log('copy')

    let text = changedText.innerText
    try {
      await navigator.clipboard.writeText(text)
      console.log('Content copied to clipboard')
      copyIcon.src = ICON_SRC_CHECK

      setTimeout(() => {
        copyIcon.src = ICON_SRC_COPY
        panel.classList.add('hidden')
        changeIcon.classList.add('hidden')
        changedText.innerText = ''
      }, 500)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  function handleSelectionForIcon(event) {
    event.stopPropagation()
    const selection = window.getSelection()
    

    if (
      event.target.closest(`.${SELECTOR_PANEL}`) ||
      event.target.closest(`.${SELECTOR_CHANGE_ICON}`)
    )
      return

    //prevent from selectionchange fires on caret
    if (selection.rangeCount === 0 || selection.isCollapsed) {
      panel.classList.add('hidden')
      changeIcon.classList.add('hidden')
      changedText.innerText = ''
      return
    }


    const anchorNode = selection.anchorNode
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    let target = event.target

    //prevent from popup closes on selection or double clicking
    if (anchorNode?.nodeType === Node.TEXT_NODE) {
      target = anchorNode.parentElement
      if (target.closest(`.${SELECTOR_PANEL}`)) {
        return
      }
    }

    if (selection.toString().trim().length === 0) {
      console.log('empty')
      changeIcon.classList.add('hidden')
      return
    }
    changedText.innerText = ''
    panel.classList.add('hidden')
    changeIcon.classList.remove('hidden')

    //prevent icon overflow
    const bottomEdge = window.innerHeight - changeIcon.offsetHeight

    changeIcon.style.top =
      rect.top + rect.height > bottomEdge
        ? window.scrollY + bottomEdge
        : window.scrollY + rect.top + rect.height + 'px'
    changeIcon.style.left = window.scrollX + rect.left + rect.width + 'px'

    //redo fix
    //треба зробити коли юзер виділяє для видалення, щоб іконка не зявлялася або відразу зникала
    setTimeout(() => {
      changeIcon.classList.add('hidden')
    }, 2500)
  }

  function handleDocumentClick(event) {
    console.log('document click')
    const selectionLength = window.getSelection().toString().length
    const isInsidePanel = !!event.target.closest(`.${SELECTOR_PANEL}`)
    const isChangeIconDisplayed = changeIcon.style.display !== 'none'
    const isPanelDisplayed = panel.style.display !== 'none'

    if ((isPanelDisplayed || isChangeIconDisplayed) && !isInsidePanel && selectionLength === 0) {
      console.log('inside')
      panel.classList.add('hidden')
      changeIcon.classList.add('hidden')
    }
  }

  // --- Event Handlers ---
  changeIcon.addEventListener('click', handleEnToUa)
  copyIcon.addEventListener('click', handleCopyClick)
  document.addEventListener('dblclick', handleSelectionForIcon)
  document.addEventListener('mouseup', handleSelectionForIcon)
  document.addEventListener('click', handleDocumentClick)
})()
