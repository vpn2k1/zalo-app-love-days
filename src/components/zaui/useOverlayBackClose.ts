import { useEffect, useRef } from "react";
import {
  shouldSuppressAppPopState,
  suppressNextAppPopState,
} from "@/utils/appPopStateGuard";

let overlayId = 0;
const overlayStack: number[] = [];

export function useOverlayBackClose(visible: boolean | undefined, close: () => void) {
  const closeRef = useRef(close);
  const idRef = useRef(0);
  const closedByBackRef = useRef(false);

  useEffect(() => {
    closeRef.current = close;
  }, [close]);

  useEffect(() => {
    if (!visible) return;

    overlayId += 1;
    const id = overlayId;
    idRef.current = id;
    closedByBackRef.current = false;
    overlayStack.push(id);
    window.history.pushState(
      { ...window.history.state, appOverlayId: id },
      "",
      window.location.href,
    );

    const handlePopState = () => {
      if (shouldSuppressAppPopState()) return;
      if (getTopOverlayId() !== id) return;

      closedByBackRef.current = true;
      removeOverlayId(id);
      closeRef.current();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      removeOverlayId(id);
      if (closedByBackRef.current) return;
      if (!isCurrentOverlayState(id)) return;

      suppressNextAppPopState();
      window.history.back();
    };
  }, [visible]);
}

function getTopOverlayId() {
  return overlayStack[overlayStack.length - 1];
}

function removeOverlayId(id: number) {
  const index = overlayStack.lastIndexOf(id);
  if (index < 0) return;

  overlayStack.splice(index, 1);
}

function isCurrentOverlayState(id: number) {
  const state = window.history.state as { appOverlayId?: number } | null;
  if (!state) return false;

  return state.appOverlayId === id;
}
