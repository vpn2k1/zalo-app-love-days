import { useEffect, useRef, useState } from "react";

import { AppSpinner, Box, Icon } from "@/components/zaui";

const refreshThreshold = 44;
const maxPullDistance = 72;
const pullResistance = 2.5;
const refreshingIndicatorHeight = 44;

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

    const reset = () => {
      active = false;
      pullDistanceRef.current = 0;
      setPullDistance(0);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (refreshing || !scrollContainer || scrollContainer.scrollTop > 0) return;

      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      active = true;
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
    page.addEventListener("touchmove", onTouchMove, { passive: false });
    page.addEventListener("touchend", onTouchEnd);
    page.addEventListener("touchcancel", reset);

    return () => {
      page.removeEventListener("touchstart", onTouchStart);
      page.removeEventListener("touchmove", onTouchMove);
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
      {refreshing && <AppSpinner />}
      {!refreshing && pullDistance > 0 && <Icon icon="zi-arrow-down" />}
    </Box>
  );
}
