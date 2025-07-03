import './styles.css'
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
  const SELECTOR_CLOSE_ICON = 'close-icon'
  const SELECTOR_REPLACE_ICON = 'replace-icon'

  const SELECTOR_ACTIONS = 'actions'
  const SELECTOR_BUTTON = 'button'
  const SELECTOR_CLOSE_BUTTON = 'close-btn'
  const SELECTOR_REPLACE_BUTTON = 'replace-btn'

  const ICON_SRC_NOTEBOOK = chrome.runtime.getURL('img/notebook.svg')
  const ICON_SRC_COPY = chrome.runtime.getURL('img/copy.svg')
  const ICON_SRC_CHECK = chrome.runtime.getURL('img/check.svg')
  const ICON_SRC_REPLACE = chrome.runtime.getURL('img/replace.svg')
  const ICON_SRC_CLOSE = chrome.runtime.getURL('img/close.svg')


  const selectionData = {
    selectedText: null,
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

  const closeIcon = document.createElement('img')
  closeIcon.className = SELECTOR_CLOSE_ICON
  closeIcon.src = ICON_SRC_CLOSE
  closeIcon.alt = 'Cross icon'

  const actionsContainer = document.createElement('div')
  actionsContainer.className = SELECTOR_ACTIONS

  const copyBtn = document.createElement('button')
  const copyButtonName = document.createTextNode('Copy')
  copyBtn.className = SELECTOR_BUTTON
  copyBtn.appendChild(copyIcon)
  copyBtn.appendChild(copyButtonName)
  actionsContainer.appendChild(copyBtn)

  const replaceBtn = document.createElement('button')
  const replaceButtonName = document.createTextNode('Replace')
  replaceBtn.className = SELECTOR_BUTTON
  replaceBtn.classList.add(SELECTOR_REPLACE_BUTTON)
  replaceBtn.appendChild(replaceIcon)
  replaceBtn.appendChild(replaceButtonName)
  actionsContainer.appendChild(replaceBtn)

  const closeBtn = document.createElement('button')
  closeBtn.className = SELECTOR_CLOSE_BUTTON
  closeBtn.appendChild(closeIcon)

  panel.appendChild(closeBtn)
  panel.appendChild(changedText)
  panel.appendChild(actionsContainer)
  document.body.appendChild(changeIcon)
  document.body.appendChild(panel)

  // --- Initial State ---
  panel.classList.add('hidden')
  changeIcon.classList.add('hidden')

  // --- Functions ---
  function handleSelection(event) {
    if (
      event.target.closest(`.${SELECTOR_PANEL}`) ||
      event.target.closest(`.${SELECTOR_CHANGE_ICON}`)
    )
      return

    const selection = window.getSelection()

    //prevent from selection fires if there's no selection or if the selection is a caret
    if (selection.rangeCount === 0) {
      resetUIAndSelectionState()
      return
    }

    selectionData.selectedText = selection.toString()

    if (selectionData.selectedText.trim().length === 0) {
      changeIcon.classList.add('hidden')
      return
    }

    const anchorNode = selection.anchorNode

    selectionData.range = selection?.getRangeAt(0)

    selectionData.rect = selectionData.range.getBoundingClientRect()

    selectionData.targetElement = event.target

    // prevent popup from closing on text selection or double-click.
    if (anchorNode?.nodeType === Node.TEXT_NODE) {
      selectionData.targetElement = anchorNode.parentElement
      if (selectionData.targetElement.closest(`.${SELECTOR_PANEL}`)) {
        return
      }
    }
    //allow extension only on input, textarea, and elements with contentEditable=true
    if (
      !selectionData.targetElement.closest('input') &&
      !selectionData.targetElement.closest('textarea') &&
      !isContentEditableElement(selectionData.targetElement)
    ) {
      resetUIAndSelectionState()
      return
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
        ? window.scrollY + bottomEdge + 'px'
        : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px'
  }

  function showConversionPanel(event) {
    event.stopPropagation()

    let arrFromSelection = selectionData.selectedText.trim().split('')
    let convertedText = arrFromSelection.map((el) => enToUaMap[el] || el).join('')
    changedText.innerText = convertedText

    changeIcon.classList.add('hidden')

    if (changedText.innerText.trim().length > 0) {
      panel.classList.remove('hidden')
    } else {
      panel.classList.add('hidden')
    }

    //prevent "The input element's type ('email') does not support selection" error
    if (selectionData.targetElement.type === 'email') {
      replaceBtn.classList.add('hidden')
    } else {
      replaceBtn.classList.remove('hidden')
    }

    //prevent panel overflow
    const bottomEdge = window.innerHeight - panel.offsetHeight
    //const bottomEdge = selectionData.rect.top - panel.offsetHeight - selectionData.rect.height
    panel.style.top =
      selectionData.rect.top + selectionData.rect.height >= bottomEdge
        ? // ? window.scrollY + bottomEdge + 'px'
          window.scrollY +
          selectionData.rect.top -
          panel.offsetHeight -
          selectionData.rect.height +
          'px'
        : window.scrollY + selectionData.rect.top + selectionData.rect.height + 'px'

    panel.style.left = window.scrollX + selectionData.rect.left + 'px'
  }

  async function handleCopyClick(event) {
    event.stopPropagation()

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
    }
    window.getSelection().removeAllRanges()
    resetUIAndSelectionState()
  }

  function handleDocumentClick(event) {
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
      resetUIAndSelectionState()
    }
  }

  function handleInputDeleting(event) {
    const key = event.key
    if (
      key === 'Delete' ||
      key === 'Backspace' ||
      (event.code == 'KeyV' && (event.ctrlKey || event.metaKey))
    ) {
      resetUIAndSelectionState()
    }
  }

  function resetUIAndSelectionState() {
    changedText.innerText = ''

    panel.classList.add('hidden')
    changeIcon.classList.add('hidden')

    selectionData.selectedText = null
    selectionData.rect = null
    selectionData.range = null
    selectionData.targetElement = null
  }

  function isContentEditableElement(element) {
    if (element.contentEditable === 'true') return true

    if (element.tagName === 'BODY') return false

    return isContentEditableElement(element.parentElement)
  }

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
})()
