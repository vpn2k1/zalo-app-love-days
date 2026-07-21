import { useCallback, useEffect, useRef } from "react";

import {
  shouldSuppressAppPopState,
  suppressNextAppPopState,
} from "@/utils/appPopStateGuard";
import {
  blurActiveTextField,
  isCurrentInputHistoryState,
  isTopInputHistoryId,
  pushInputFocusHistoryState,
  removeInputHistoryId,
} from "@/utils/inputFocusHistory";
import {
  getKeyboardHeight,
  getMeasuredKeyboardHeight,
  isEditableTextField,
  isTextField,
  scrollElementToMiddle,
} from "@/utils/inputKeyboard";

const SCROLL_DELAYS = [80, 250, 500];
const CLICK_SUPPRESSION_MS = 500;

export function useAppInputKeyboardFix() {
  const focusedRef = useRef(false);
  const historyIdRef = useRef<number | null>(null);
  const keyboardVisibleRef = useRef(false);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<number | null>(null);
  const timersRef = useRef<Set<number>>(new Set());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const resetKeyboardHeight = useCallback(() => {
    clearTimers();
    keyboardVisibleRef.current = false;
    document.documentElement.style.setProperty("--zma-keyboard-height", "0px");
  }, [clearTimers]);

  const clearClickSuppression = useCallback(() => {
    suppressClickRef.current = false;
    const timer = suppressClickTimerRef.current;
    if (timer === null) return;

    window.clearTimeout(timer);
    suppressClickTimerRef.current = null;
  }, []);

  const updateKeyboardHeight = useCallback(() => {
    const measuredKeyboardHeight = getMeasuredKeyboardHeight();
    keyboardVisibleRef.current = measuredKeyboardHeight > 0;
    document.documentElement.style.setProperty(
      "--zma-keyboard-height",
      `${getKeyboardHeight(measuredKeyboardHeight)}px`,
    );
  }, []);

  const scrollFocusedField = useCallback(() => {
    const activeElement = document.activeElement;
    if (!isEditableTextField(activeElement)) return;

    scrollElementToMiddle(activeElement);
  }, []);

  const scheduleScroll = useCallback(() => {
    clearTimers();

    SCROLL_DELAYS.forEach((delay) => {
      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);
        updateKeyboardHeight();
        scrollFocusedField();
      }, delay);

      timersRef.current.add(timer);
    });
  }, [clearTimers, scrollFocusedField, updateKeyboardHeight]);

  useEffect(() => {
    const viewport = window.visualViewport;

    const clearHistoryState = () => {
      const id = historyIdRef.current;
      if (id === null) return;

      historyIdRef.current = null;
      removeInputHistoryId(id);
    };

    const handleFocus = (event: FocusEvent) => {
      if (!isEditableTextField(event.target)) return;

      focusedRef.current = true;
      historyIdRef.current = pushInputFocusHistoryState();
      updateKeyboardHeight();
      scheduleScroll();
    };

    const handleOutsidePress = (event: Event) => {
      if (!focusedRef.current) return;
      if (isEditableTextField(event.target)) return;
      if (!isEditableTextField(document.activeElement)) return;
      if (event.type === "mousedown") {
        clearClickSuppression();
        suppressClickRef.current = true;
        suppressClickTimerRef.current = window.setTimeout(clearClickSuppression, CLICK_SUPPRESSION_MS);
      }
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      blurActiveTextField();
    };

    const handleSuppressedClick = (event: MouseEvent) => {
      if (!suppressClickRef.current) return;
      clearClickSuppression();
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    const handleBlur = (event: FocusEvent) => {
      if (!isTextField(event.target)) return;

      const id = historyIdRef.current;
      focusedRef.current = false;
      clearHistoryState();
      resetKeyboardHeight();
      if (id === null) return;
      if (!isCurrentInputHistoryState(id)) return;

      suppressNextAppPopState();
      window.history.back();
    };

    const handlePopState = () => {
      const id = historyIdRef.current;
      if (id === null) return;
      if (shouldSuppressAppPopState()) return;
      if (!isTopInputHistoryId(id)) return;

      clearHistoryState();
      focusedRef.current = false;
      blurActiveTextField();
      resetKeyboardHeight();
    };

    const handleViewportChange = () => {
      if (!focusedRef.current) {
        resetKeyboardHeight();
        return;
      }

      if (keyboardVisibleRef.current && getMeasuredKeyboardHeight() <= 0) {
        focusedRef.current = false;
        blurActiveTextField();
        resetKeyboardHeight();
        return;
      }

      updateKeyboardHeight();
      scrollFocusedField();
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleSuppressedClick, true);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);
    document.addEventListener("mousedown", handleOutsidePress, true);
    document.addEventListener("touchstart", handleOutsidePress, { capture: true, passive: false });
    viewport?.addEventListener("resize", handleViewportChange);
    viewport?.addEventListener("scroll", handleViewportChange);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleSuppressedClick, true);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
      document.removeEventListener("mousedown", handleOutsidePress, true);
      document.removeEventListener("touchstart", handleOutsidePress, true);
      clearHistoryState();
      clearClickSuppression();
      viewport?.removeEventListener("resize", handleViewportChange);
      viewport?.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      resetKeyboardHeight();
    };
  }, [
    clearClickSuppression,
    resetKeyboardHeight,
    scheduleScroll,
    scrollFocusedField,
    updateKeyboardHeight,
  ]);
}
