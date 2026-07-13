import { createElement, useLayoutEffect, type ComponentProps } from "react";
import { Page as ZmpPage } from "zmp-ui";

import { scheduleRouteScrollReset } from "@/utils/scroll";

export {
  App,
  AnimationRoutes,
  Avatar,
  Box,
  Button,
  Calendar,
  Icon,
  Route,
  SnackbarProvider,
  Text,
  useLocation,
  useNavigate,
  useSearchParams,
  ZMPRouter,
} from "zmp-ui";
export { AppActionSheet } from "@/components/zaui/AppActionSheet";
export { AppImageViewer } from "@/components/zaui/AppImageViewer";
export type { AppImageViewerImage } from "@/components/zaui/AppImageViewer";
export { AppModal } from "@/components/zaui/AppModal";
export { AppSheet } from "@/components/zaui/AppSheet";
export type { AppSheetRef } from "@/components/zaui/AppSheet";
export { AppSnackbarProvider } from "@/components/zaui/AppSnackbarProvider";
export { AppSpinner } from "@/components/zaui/AppSpinner";
export { AppSwiper } from "@/components/zaui/AppSwiper";
export { useAppSnackbar } from "@/components/zaui/useAppSnackbar";

export function Page(props: ComponentProps<typeof ZmpPage>) {
  useLayoutEffect(() => {
    return scheduleRouteScrollReset();
  }, []);

  return createElement(ZmpPage, props);
}
