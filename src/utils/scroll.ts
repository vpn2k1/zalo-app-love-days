const SCROLL_CONTAINER_SELECTOR = [
  ".zaui-routes-item",
  ".zaui-page",
  "[data-scroll-container]",
  ".overflow-auto",
  ".overflow-y-auto",
].join(",");

export function resetRouteScroll() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTo(0, 0);
  document.body.scrollTo(0, 0);
  document.scrollingElement?.scrollTo(0, 0);
  document.querySelectorAll<HTMLElement>(SCROLL_CONTAINER_SELECTOR).forEach(
    (container) => {
      container.scrollTo(0, 0);
    },
  );
}

export function scheduleRouteScrollReset() {
  resetRouteScroll();

  const frame = window.requestAnimationFrame(resetRouteScroll);
  let nestedFrame = 0;
  const nextFrame = window.requestAnimationFrame(() => {
    nestedFrame = window.requestAnimationFrame(resetRouteScroll);
  });
  const afterTransition = window.setTimeout(resetRouteScroll, 450);
  const afterSettled = window.setTimeout(resetRouteScroll, 650);

  return () => {
    window.cancelAnimationFrame(frame);
    window.cancelAnimationFrame(nextFrame);
    window.cancelAnimationFrame(nestedFrame);
    window.clearTimeout(afterTransition);
    window.clearTimeout(afterSettled);
  };
}
