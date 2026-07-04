import { Sheet } from "zmp-ui";
import type { ActionSheetProps } from "zmp-ui/sheet";

type Props = Omit<ActionSheetProps, "mask" | "maskClosable"> & {
  mask?: ActionSheetProps["mask"];
  maskClosable?: ActionSheetProps["maskClosable"];
};

export function AppActionSheet({
  divider = true,
  groupDivider = true,
  mask = true,
  maskClosable = true,
  unmountOnClose = true,
  ...actionSheetProps
}: Props) {
  return (
    <Sheet.Actions
      {...actionSheetProps}
      divider={divider}
      groupDivider={groupDivider}
      mask={mask}
      maskClosable={maskClosable}
      unmountOnClose={unmountOnClose}
    />
  );
}
