export function isContentEditableElement(element) {
  if (!(element instanceof HTMLElement)) return false

  if (element.contentEditable === 'true') return true

  if (element.contentEditable === 'false') return false

  if (element.tagName === 'BODY') return false

  return isContentEditableElement(element.parentElement)
}
