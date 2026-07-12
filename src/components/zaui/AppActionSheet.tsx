import { useCallback, type SyntheticEvent } from "react";
import { Sheet } from "zmp-ui";
import type { ActionSheetProps } from "zmp-ui/sheet";

import { useOverlayBackClose } from "@/components/zaui/useOverlayBackClose";

type Props = Omit<ActionSheetProps, "mask" | "maskClosable"> & {
  mask?: ActionSheetProps["mask"];
  maskClosable?: ActionSheetProps["maskClosable"];
};

export function AppActionSheet({
  divider = true,
  groupDivider = true,
  mask = true,
  maskClosable = true,
  onClose,
  unmountOnClose = true,
  ...actionSheetProps
}: Props) {
  const closeFromBack = useCallback(() => {
    onClose?.({} as SyntheticEvent);
  }, [onClose]);

  useOverlayBackClose(actionSheetProps.visible, closeFromBack);

  return (
    <Sheet.Actions
      {...actionSheetProps}
      onClose={onClose}
      divider={divider}
      groupDivider={groupDivider}
      mask={mask}
      maskClosable={maskClosable}
      unmountOnClose={unmountOnClose}
    />
  );
}
