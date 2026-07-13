import { useEffect, useRef, useState } from "react";

import { AppSpinner, Box } from "@/components/zaui";

const refreshThreshold = 44;
const maxPullDistance = 72;
const pullResistance = 2.5;
const refreshingIndicatorHeight = 32;

type Props = {
  onRefresh: () => Promise<unknown>;
  pageId: string;
  refreshing: boolean;
};

export function AppPullToRefresh({ onRefresh, pageId, refreshing }: Props) {
  const pullDistanceRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    const page = document.getElementById(pageId);
    if (!page) return;

    const scrollContainer = page.closest<HTMLElement>(".zaui-routes-item");
    let active = false;
    let startX = 0;
    let startY = 0;

    const removeMoveListener = () => {
      page.removeEventListener("touchmove", onTouchMove);
    };

    const reset = () => {
      active = false;
      pullDistanceRef.current = 0;
      setPullDistance(0);
      removeMoveListener();
    };

    const onTouchStart = (event: TouchEvent) => {
      if (refreshing || !isAtTop(page, scrollContainer)) return;

      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      active = true;
      page.addEventListener("touchmove", onTouchMove, { passive: false });
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!active) return;

      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - startX);
      const deltaY = touch.clientY - startY;
      if (deltaY <= 0 || deltaX >= deltaY) {
        reset();
        return;
      }

      if (!isAtTop(page, scrollContainer)) {
        reset();
        return;
      }

      if (event.cancelable) event.preventDefault();
      const distance = Math.min(maxPullDistance, deltaY / pullResistance);
      pullDistanceRef.current = distance;
      setPullDistance(distance);
    };

    const onTouchEnd = () => {
      const shouldRefresh = pullDistanceRef.current >= refreshThreshold;
      reset();
      if (!shouldRefresh || refreshing) return;

      void onRefresh();
    };

    page.addEventListener("touchstart", onTouchStart, { passive: true });
    page.addEventListener("touchend", onTouchEnd);
    page.addEventListener("touchcancel", reset);

    return () => {
      page.removeEventListener("touchstart", onTouchStart);
      removeMoveListener();
      page.removeEventListener("touchend", onTouchEnd);
      page.removeEventListener("touchcancel", reset);
    };
  }, [onRefresh, pageId, refreshing]);

  let indicatorHeight = pullDistance;
  if (refreshing) indicatorHeight = refreshingIndicatorHeight;

  return (
    <Box
      aria-live="polite"
      className="flex items-center justify-center overflow-hidden text-[#d9467e] transition-[height] duration-150"
      style={{ height: indicatorHeight }}
    >
      {refreshing && (
        <AppSpinner className="app-pull-to-refresh-spinner" logo={null} />
      )}
    </Box>
  );
}

function isAtTop(page: HTMLElement, scrollContainer: HTMLElement | null) {
  return getScrollTop(page) <= 0 && getScrollTop(scrollContainer) <= 0;
}

function getScrollTop(element: HTMLElement | null) {
  const documentScrollTop = document.scrollingElement?.scrollTop ?? 0;
  const windowScrollTop = window.scrollY || 0;
  const elementScrollTop = element?.scrollTop ?? 0;

  return Math.max(documentScrollTop, windowScrollTop, elementScrollTop);
}
