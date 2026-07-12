import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { SyntheticEvent } from "react";
import { Sheet } from "zmp-ui";
import type { SheetProps } from "zmp-ui/sheet";
import { useOverlayBackClose } from "@/components/zaui/useOverlayBackClose";

type Props = Omit<
  SheetProps,
  "autoHeight" | "mask" | "maskClosable" | "ref"
> & {
  autoHeight?: SheetProps["autoHeight"];
  mask?: SheetProps["mask"];
  maskClosable?: SheetProps["maskClosable"];
};

export type AppSheetRef = {
  close: () => void;
  open: () => void;
};

export const AppSheet = forwardRef<AppSheetRef, Props>(function AppSheet(
  {
    mask = true,
    maskClosable = true,
    swipeToClose = false,
    unmountOnClose = true,
    visible,
    onClose,
    ...sheetProps
  }: Props,
  ref,
) {
  const [internalVisible, setInternalVisible] = useState(false);
  const isControlled = visible !== undefined;
  const currentVisible = visible ?? internalVisible;

  useEffect(() => {
    if (!currentVisible) return;

    return lockBackgroundScroll();
  }, [currentVisible]);

  const open = useCallback(() => {
    setInternalVisible(true);
  }, []);

  const close = useCallback(() => {
    if (!isControlled) {
      setInternalVisible(false);
    }
  }, [isControlled]);

  const handleClose = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      close();
      onClose?.(event);
    },
    [close, onClose],
  );
  const closeFromBack = useCallback(() => {
    close();
    onClose?.({} as SyntheticEvent);
  }, [close, onClose]);

  useOverlayBackClose(currentVisible, closeFromBack);
  useImperativeHandle(ref, () => ({ close, open }), [close, open]);

  return (
    <Sheet
      {...sheetProps}
      visible={currentVisible}
      onClose={handleClose}
      height={getSheetHeight(sheetProps.autoHeight)}
      mask={mask}
      maskClosable={maskClosable}
      swipeToClose={swipeToClose}
      unmountOnClose={unmountOnClose}
    />
  );
});

function getSheetHeight(autoHeight?: SheetProps["autoHeight"]) {
  if (autoHeight) return undefined;

  return "90dvh";
}

function lockBackgroundScroll() {
  const preventBackgroundScroll = (event: Event) => {
    if (isSheetEvent(event)) return;

    event.preventDefault();
  };
  const options = { passive: false };
  document.addEventListener("touchmove", preventBackgroundScroll, options);
  document.addEventListener("wheel", preventBackgroundScroll, options);

  return () => {
    document.removeEventListener("touchmove", preventBackgroundScroll);
    document.removeEventListener("wheel", preventBackgroundScroll);
  };
}

function isSheetEvent(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return false;

  return Boolean(target.closest(".zaui-sheet-content"));
}
