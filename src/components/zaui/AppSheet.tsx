import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import type { SyntheticEvent } from "react";
import { Sheet } from "zmp-ui";
import type { SheetProps } from "zmp-ui/sheet";

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

  useImperativeHandle(ref, () => ({ close, open }), [close, open]);

  return (
    <Sheet
    {...sheetProps}
      visible={currentVisible}
      onClose={handleClose}
      height={sheetProps.autoHeight ? undefined: "90dvh"}
      mask={mask}
      maskClosable={maskClosable}
      swipeToClose={swipeToClose}
      unmountOnClose={unmountOnClose}
    />
  );
});
