const FALLBACK_KEYBOARD_HEIGHT = 120;
const TARGET_VIEWPORT_RATIO = 0.55;

export function getMeasuredKeyboardHeight() {
  const viewport = window.visualViewport;
  if (!viewport) return 0;

  return Math.max(
    0,
    window.innerHeight - viewport.height - viewport.offsetTop,
  );
}

export function getKeyboardHeight(measuredKeyboardHeight: number) {
  if (measuredKeyboardHeight > 0) return measuredKeyboardHeight;

  return FALLBACK_KEYBOARD_HEIGHT;
}

export function isEditableTextField(
  target: EventTarget | null,
): target is HTMLElement {
  if (!isTextField(target)) return false;
  if (target instanceof HTMLInputElement && target.readOnly) return false;
  if (target instanceof HTMLInputElement && target.disabled) return false;
  if (target instanceof HTMLTextAreaElement && target.readOnly) return false;
  if (target instanceof HTMLTextAreaElement && target.disabled) return false;
  if (target instanceof HTMLSelectElement && target.disabled) return false;

  return true;
}

export function isTextField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return target.matches("input, textarea, select, [contenteditable='true']");
}

export function scrollElementToMiddle(element: HTMLElement) {
  const delta = getScrollDelta(element);
  if (delta === 0) return;

  const scrollContainer = getScrollContainer(element);
  scrollByDelta(scrollContainer, delta);
}

function getScrollDelta(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = getViewportHeight();
  const targetTop = viewportHeight * TARGET_VIEWPORT_RATIO;

  return rect.top + rect.height / 2 - targetTop;
}

function getViewportHeight() {
  const viewport = window.visualViewport;
  if (!viewport) return window.innerHeight;

  return viewport.height;
}

function getScrollContainer(element: HTMLElement) {
  let parent = element.parentElement;

  while (parent) {
    if (isScrollable(parent)) return parent;
    parent = parent.parentElement;
  }

  return null;
}

function isScrollable(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  const canScroll = style.overflowY === "auto" || style.overflowY === "scroll";

  if (!canScroll) return false;

  return element.scrollHeight > element.clientHeight;
}

function scrollByDelta(scrollContainer: HTMLElement | null, delta: number) {
  if (!scrollContainer) {
    window.scrollBy({ top: delta, behavior: "auto" });
    return;
  }

  scrollContainer.scrollBy({ top: delta, behavior: "auto" });
}
