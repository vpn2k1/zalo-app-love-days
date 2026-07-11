import { useEffect } from "react";

const KEYBOARD_HEIGHT_PROPERTY = "--app-keyboard-height";
const KEYBOARD_FALLBACK_HEIGHT = 320;

export function useKeyboardViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    let baselineHeight = getViewportBaseline(viewport);
    let focusTimer = 0;

    const updateKeyboardHeight = () => {
      const keyboardHeight = getKeyboardHeight(viewport, baselineHeight);
      document.documentElement.style.setProperty(
        KEYBOARD_HEIGHT_PROPERTY,
        `${keyboardHeight}px`,
      );

      if (keyboardHeight === 0) return;

      scrollActiveElementIntoView();
    };

    const handleResize = () => {
      if (!hasTextInputFocus()) {
        baselineHeight = getViewportBaseline(viewport);
      }

      updateKeyboardHeight();
    };

    const handleFocusIn = () => {
      updateKeyboardHeight();
      window.clearTimeout(focusTimer);
      focusTimer = window.setTimeout(() => {
        if (!hasTextInputFocus()) return;

        const keyboardHeight = getKeyboardHeight(viewport, baselineHeight);
        if (keyboardHeight > 0) {
          updateKeyboardHeight();
          return;
        }

        document.documentElement.style.setProperty(
          KEYBOARD_HEIGHT_PROPERTY,
          `${KEYBOARD_FALLBACK_HEIGHT}px`,
        );
        scrollActiveElementIntoView();
      }, 280);
    };

    const handleFocusOut = () => {
      window.clearTimeout(focusTimer);
      window.setTimeout(updateKeyboardHeight, 80);
    };

    updateKeyboardHeight();
    viewport?.addEventListener("resize", handleResize);
    viewport?.addEventListener("scroll", updateKeyboardHeight);
    window.addEventListener("resize", handleResize);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      window.clearTimeout(focusTimer);
      viewport?.removeEventListener("resize", handleResize);
      viewport?.removeEventListener("scroll", updateKeyboardHeight);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.documentElement.style.removeProperty(KEYBOARD_HEIGHT_PROPERTY);
    };
  }, []);
}

function getViewportBaseline(viewport?: VisualViewport | null) {
  if (!viewport) return window.innerHeight;

  return Math.max(window.innerHeight, viewport.height + viewport.offsetTop);
}

function getKeyboardHeight(
  viewport: VisualViewport | null | undefined,
  baselineHeight: number,
) {
  if (!viewport) return 0;

  return Math.max(
    0,
    baselineHeight - viewport.height - viewport.offsetTop,
    window.innerHeight - viewport.height - viewport.offsetTop,
  );
}

function hasTextInputFocus() {
  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLInputElement) return true;
  if (activeElement instanceof HTMLTextAreaElement) return true;

  return activeElement?.getAttribute("contenteditable") === "true";
}

function scrollActiveElementIntoView() {
  const activeElement = document.activeElement;
  if (!(activeElement instanceof HTMLElement)) return;

  requestAnimationFrame(() => {
    activeElement.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
