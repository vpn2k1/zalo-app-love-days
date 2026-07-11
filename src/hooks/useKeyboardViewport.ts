import { useEffect } from "react";

const KEYBOARD_HEIGHT_PROPERTY = "--app-keyboard-height";

export function useKeyboardViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateKeyboardHeight = () => {
      const keyboardHeight = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      document.documentElement.style.setProperty(
        KEYBOARD_HEIGHT_PROPERTY,
        `${keyboardHeight}px`,
      );

      if (keyboardHeight === 0) return;
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLElement)) return;

      requestAnimationFrame(() => {
        activeElement.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    };

    updateKeyboardHeight();
    viewport.addEventListener("resize", updateKeyboardHeight);
    viewport.addEventListener("scroll", updateKeyboardHeight);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardHeight);
      viewport.removeEventListener("scroll", updateKeyboardHeight);
      document.documentElement.style.removeProperty(KEYBOARD_HEIGHT_PROPERTY);
    };
  }, []);
}
