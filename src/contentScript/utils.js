export function isContentEditableElement(element) {
  if (!(element instanceof HTMLElement)) return false;

  if (element.contentEditable === 'true') return true;

  if (element.contentEditable === 'false') return false;

  if (element.tagName === 'BODY') return false;

  return isContentEditableElement(element.parentElement);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy: ', error);
    return false;
  }
}

export function getHiddenElementHeight(el) {
  const originalDisplay = el.style.display;
  const originalPosition = el.style.position;
  const originalVisibility = el.style.visibility;
  const originalTop = el.style.top;
  const originalLeft = el.style.left;

  el.style.setProperty('display', 'block', 'important');
  el.style.setProperty('position', 'absolute', 'important');
  el.style.setProperty('visibility', 'hidden', 'important');
  el.style.top = '-9999px';
  el.style.left = '-9999px';

  const height = el.offsetHeight;

  el.style.display = originalDisplay;
  el.style.position = originalPosition;
  el.style.visibility = originalVisibility;
  el.style.top = originalTop;
  el.style.left = originalLeft;

  return height;
}
