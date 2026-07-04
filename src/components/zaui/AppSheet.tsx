import { Sheet } from "zmp-ui";
import type { SheetProps } from "zmp-ui/sheet";

type Props = Omit<SheetProps, "autoHeight" | "mask" | "maskClosable" | "ref"> & {
  autoHeight?: SheetProps["autoHeight"];
  mask?: SheetProps["mask"];
  maskClosable?: SheetProps["maskClosable"];
};

export function AppSheet({
  autoHeight = true,
  mask = true,
  maskClosable = true,
  swipeToClose = true,
  unmountOnClose = true,
  ...sheetProps
}: Props) {
  return (
    <Sheet
      {...sheetProps}
      autoHeight={autoHeight}
      mask={mask}
      maskClosable={maskClosable}
      swipeToClose={swipeToClose}
      unmountOnClose={unmountOnClose}
    />
  );
}
