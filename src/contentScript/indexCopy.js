import './contentStyles.css'
;(function () {
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
  const SELECTOR_REPLACE_ICON = 'replace-icon'
  const SELECTOR_ACTIONS = 'actions'
  const SELECTOR_BUTTON = 'button'

  const ICON_SRC_NOTEBOOK = chrome.runtime.getURL('img/notebook.png')
  const ICON_SRC_COPY = chrome.runtime.getURL('img/copy.svg')
  const ICON_SRC_CHECK = chrome.runtime.getURL('img/check.svg')
  const ICON_SRC_REPLACE = chrome.runtime.getURL('img/replace.svg')

  const selectionData = {
    selection: null,
    range: null,
    rect: null,
    targetElement: null,
  }

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

  const replaceIcon = document.createElement('img')
  replaceIcon.className = SELECTOR_REPLACE_ICON
  replaceIcon.src = ICON_SRC_REPLACE
  replaceIcon.alt = 'Replace text icon'

  const actionsContainer = document.createElement('div')
  actionsContainer.className = SELECTOR_ACTIONS

  //copy button
  const copyBtn = document.createElement('button')
  const copyButtonName = document.createTextNode('Copy')
  copyBtn.className = SELECTOR_BUTTON
  copyBtn.appendChild(copyIcon)
  copyBtn.appendChild(copyButtonName)
  actionsContainer.appendChild(copyBtn)

  //replace button
  const replaceBtn = document.createElement('button')
  const replaceButtonName = document.createTextNode('Replace')
  replaceBtn.className = SELECTOR_BUTTON
  replaceBtn.appendChild(replaceIcon)
  replaceBtn.appendChild(replaceButtonName)
  actionsContainer.appendChild(replaceBtn)

  panel.appendChild(changedText)
  panel.appendChild(actionsContainer)
  document.body.appendChild(changeIcon)
  document.body.appendChild(panel)

  // --- Initial State ---
  panel.classList.add('hidden')
  changeIcon.classList.add('hidden')

  // --- Functions ---
  function handleSelection(event) {
    selectionData.selection = window.getSelection()

    if (
      event.target.closest(`.${SELECTOR_PANEL}`) ||
      event.target.closest(`.${SELECTOR_CHANGE_ICON}`)
    )
      return

    //prevent from selection fires on caret
    if (selectionData.selection.rangeCount === 0 
      //|| selectionData.selection.type === 'Caret'
      ) {
      resetUIAndSelectionState()
      return
    }

    if (selectionData.selection.toString().trim().length === 0) {
      console.log('empty')
      changeIcon.classList.add('hidden')
      return
    }

    const anchorNode = selectionData.selection.anchorNode

    selectionData.range = selectionData.selection?.getRangeAt(0)
    selectionData.rect = selectionData.range.getBoundingClientRect()

    selectionData.targetElement = event.target

    //prevent from popup closes on selection or double clicking
    if (anchorNode?.nodeType === Node.TEXT_NODE) {
      selectionData.targetElement = anchorNode.parentElement
      if (selectionData.targetElement.closest(`.${SELECTOR_PANEL}`)) {
        return
      }
    }

    changedText.innerText = ''
    panel.classList.add('hidden')
    changeIcon.classList.remove('hidden')

    //prevent icon overflow
    const bottomEdge = window.innerHeight - changeIcon.offsetHeight

    if (event.target.closest('input') || event.target.closest('textarea')) {
      selectionData.rect = selectionData.targetElement.getBoundingClientRect()
      changeIcon.style.left = window.scrollX + selectionData.rect.left + 'px'
    } else {
      changeIcon.style.left =
        window.scrollX + selectionData.rect.left + selectionData.rect.width + 'px'
    }

    changeIcon.style.top =
      selectionData.rect.top + selectionData.rect.height > bottomEdge
        ? window.scrollY + bottomEdge
        : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px'
  }

  function showConversionPanel(event) {
    console.log('image click')
    event.stopPropagation()

    let arrFromSelection = selectionData.selection.toString().trim().split('')
    let convertedText = arrFromSelection.map((el) => enToUaMap[el] || el).join('')
    changedText.innerText = convertedText

    changeIcon.classList.add('hidden')

    if (changedText.innerText.trim().length > 0) {
      panel.classList.remove('hidden')
    } else {
      panel.classList.add('hidden')
    }

    //prevent panel overflow
    const bottomEdge = window.innerHeight - panel.offsetHeight
    panel.style.top =
      selectionData.rect.top + selectionData.rect.height >= bottomEdge
        ? window.scrollY + bottomEdge + 'px'
        : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px'

    panel.style.left = window.scrollX + selectionData.rect.left + 'px'
  }

  async function handleCopyClick(event) {
    event.stopPropagation()
    console.log('copy')

    let text = changedText.innerText
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      console.log('Content copied to clipboard')
      copyIcon.src = ICON_SRC_CHECK

      setTimeout(() => {
        copyIcon.src = ICON_SRC_COPY
        resetUIAndSelectionState()
      }, 500)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  function handleReplaceClick(event) {
    event.stopPropagation()
    const convertedText = changedText.innerText
    if (
      selectionData.targetElement.tagName === 'INPUT' ||
      selectionData.targetElement.tagName === 'TEXTAREA'
    ) {
      const start = selectionData.targetElement.selectionStart
      const end = selectionData.targetElement.selectionEnd

      selectionData.targetElement.setRangeText(convertedText, start, end, 'end')
      selectionData.targetElement.focus()
    } else {
      selectionData.range.deleteContents()
      selectionData.range.insertNode(document.createTextNode(convertedText))
      selectionData.selection.removeAllRanges()
    }
    resetUIAndSelectionState()
  }

  function handleDocumentClick(event) {
    console.log('document click')
    const selectionLength = window.getSelection().toString().length
    const isInsidePanel = !!event.target.closest(`.${SELECTOR_PANEL}`)
    const isInsideChangeIcon = !!event.target.closest(`.${SELECTOR_CHANGE_ICON}`)
    const isChangeIconDisplayed = !changeIcon.classList.contains('hidden')
    const isPanelDisplayed = !panel.classList.contains('hidden')

    if (
      (isPanelDisplayed || isChangeIconDisplayed) &&
      !isInsidePanel &&
      !isInsideChangeIcon &&
      selectionLength === 0
    ) {
      console.log('inside')
      panel.classList.add('hidden')
      changeIcon.classList.add('hidden')

      //can cause problem with selection !!!
      //resetUIAndSelectionState()
    }
  }

  function handleInputDeleting(event) {
    const key = event.key
    if (
      key === 'Delete' ||
      key === 'Backspace' ||
      (event.code == 'KeyV' && (event.ctrlKey || event.metaKey))
    ) {
      console.log('delete')
      resetUIAndSelectionState()
    }
  }

  function resetUIAndSelectionState() {
    changedText.innerText = ''

    panel.classList.add('hidden')
    changeIcon.classList.add('hidden')

    selectionData.selection = null
    selectionData.rect = null
    selectionData.range = null
    selectionData.targetElement = null
  }

  // --- Event Handlers ---
  changeIcon.addEventListener('mouseup', showConversionPanel)
  copyBtn.addEventListener('click', handleCopyClick)
  replaceBtn.addEventListener('click', handleReplaceClick)

  document.addEventListener('dblclick', handleSelection)
  document.addEventListener('mouseup', handleSelection)
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleInputDeleting)
})()







