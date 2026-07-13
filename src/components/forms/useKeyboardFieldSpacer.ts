import { useCallback, useEffect, useRef, useState } from "react";

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

const FALLBACK_KEYBOARD_HEIGHT = 200;
const SCROLL_DELAYS = [60, 240];
const TARGET_VIEWPORT_RATIO = 0.42;

export function useKeyboardFieldSpacer() {
  const [focused, setFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(0);

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<Set<number>>(new Set());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const scrollFieldIntoView = useCallback(() => {
    scrollElementToMiddle(fieldRef.current);
  }, []);

  const scheduleScroll = useCallback(() => {
    clearTimers();

    SCROLL_DELAYS.forEach((delay) => {
      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);
        scrollFieldIntoView();
      }, delay);

      timersRef.current.add(timer);
    });
  }, [clearTimers, scrollFieldIntoView]);

  const updateSpacerHeight = useCallback(() => {
    setSpacerHeight(getKeyboardHeight());
  }, []);

  const openSpacer = useCallback(() => {
    setFocused(true);
    setIsKeyboardVisible(true);
    updateSpacerHeight();
    scheduleScroll();
  }, [scheduleScroll, updateSpacerHeight]);

  const closeSpacer = useCallback(() => {
    setFocused(false);
    setIsKeyboardVisible(false);
    clearTimers();
    setSpacerHeight(0);
  }, [clearTimers]);

  useEffect(() => {
    if (!focused) return;

    const id = pushInputFocusHistoryState();
    let closedByBack = false;
    const viewport = window.visualViewport;

    const handlePopState = () => {
      if (shouldSuppressAppPopState()) return;
      if (!isTopInputHistoryId(id)) return;

      closedByBack = true;
      removeInputHistoryId(id);
      blurActiveTextField();
      closeSpacer();
    };

    const handleViewportChange = () => {
      updateSpacerHeight();
      scheduleScroll();
    };

    window.addEventListener("popstate", handlePopState);
    viewport?.addEventListener("resize", handleViewportChange);
    viewport?.addEventListener("scroll", handleViewportChange);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      viewport?.removeEventListener("resize", handleViewportChange);
      viewport?.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);

      removeInputHistoryId(id);

      if (closedByBack) return;
      if (!isCurrentInputHistoryState(id)) return;

      suppressNextAppPopState();
      window.history.back();
    };
  }, [closeSpacer, focused, scheduleScroll, updateSpacerHeight]);

  useEffect(() => {
    if (!isKeyboardVisible) {
      closeSpacer();
    }
  }, [isKeyboardVisible]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return {
    closeSpacer,
    fieldRef,
    openSpacer,
    spacerHeight,

    // thêm 2 field này
    focused,
    isKeyboardVisible,
  };
}

function getKeyboardHeight() {
  const viewport = window.visualViewport;
  if (!viewport) return FALLBACK_KEYBOARD_HEIGHT;

  const keyboardHeight = Math.max(
    0,
    window.innerHeight - viewport.height - viewport.offsetTop,
  );

  if (keyboardHeight > 0) return keyboardHeight;

  return FALLBACK_KEYBOARD_HEIGHT;
}

function scrollElementToMiddle(element: HTMLElement | null) {
  if (!element) return;

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
