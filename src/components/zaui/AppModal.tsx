import { useCallback, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { Modal } from "zmp-ui";
import type { ModalProps } from "zmp-ui/modal";

import { useOverlayBackClose } from "@/components/zaui/useOverlayBackClose";

type Props = Omit<ModalProps, "mask" | "maskClosable"> & {
  mask?: ModalProps["mask"];
  maskClosable?: ModalProps["maskClosable"];
};

export function AppModal({
  mask = true,
  maskClosable = true,
  onClose,
  unmountOnClose = true,
  ...modalProps
}: Props) {
  const close = useCallback(() => {
    onClose?.({} as SyntheticEvent);
  }, [onClose]);

  useOverlayBackClose(modalProps.visible, close);

  return createPortal(
    <Modal
      {...modalProps}
      onClose={onClose}
      mask={mask}
      maskClosable={maskClosable}
      unmountOnClose={unmountOnClose}
    />,
    document.body,
  );
}
