import { useEffect, useLayoutEffect } from "react";

import { useLocation } from "@/components/zaui";
import { scheduleRouteScrollReset } from "@/utils/scroll";

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
    return scheduleRouteScrollReset();
  }, [location.pathname, location.search]);
}
