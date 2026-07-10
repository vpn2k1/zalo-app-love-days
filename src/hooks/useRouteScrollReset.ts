import { useEffect, useLayoutEffect } from "react";

import { useLocation } from "@/components/zaui";

const SCROLL_CONTAINER_SELECTOR = [
  ".zaui-routes-item",
  ".zaui-page",
  "[data-scroll-container]",
  ".overflow-auto",
  ".overflow-y-auto",
].join(",");

export function useRouteScrollReset() {
  const location = useLocation();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(resetRouteScroll);
    let nestedFrame = 0;
    const nextFrame = window.requestAnimationFrame(() => {
      nestedFrame = window.requestAnimationFrame(resetRouteScroll);
    });
    const afterTransition = window.setTimeout(resetRouteScroll, 320);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(nextFrame);
      window.cancelAnimationFrame(nestedFrame);
      window.clearTimeout(afterTransition);
    };
  }, [location.pathname, location.search]);
}

function resetRouteScroll() {
  window.scrollTo(0, 0);
  document.scrollingElement?.scrollTo(0, 0);
  document.querySelectorAll<HTMLElement>(SCROLL_CONTAINER_SELECTOR).forEach(
    (container) => {
      container.scrollTo(0, 0);
    },
  );
}
