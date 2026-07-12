import { hideKeyboard } from "zmp-sdk";

let inputHistoryId = 0;
const inputHistoryStack: number[] = [];

export function pushInputFocusHistoryState() {
  inputHistoryId += 1;
  const id = inputHistoryId;
  inputHistoryStack.push(id);
  window.history.pushState(
    { ...window.history.state, appInputFocusId: id },
    "",
    window.location.href,
  );

  return id;
}

export function blurActiveTextField() {
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLInputElement) {
    activeElement.blur();
    void hideKeyboard().catch(() => undefined);
    return;
  }
  if (activeElement instanceof HTMLTextAreaElement) {
    activeElement.blur();
    void hideKeyboard().catch(() => undefined);
  }
}

export function isTopInputHistoryId(id: number) {
  return inputHistoryStack[inputHistoryStack.length - 1] === id;
}

export function removeInputHistoryId(id: number) {
  const index = inputHistoryStack.lastIndexOf(id);
  if (index < 0) return;

  inputHistoryStack.splice(index, 1);
}

export function isCurrentInputHistoryState(id: number) {
  const state = window.history.state as { appInputFocusId?: number } | null;
  if (!state) return false;

  return state.appInputFocusId === id;
}
