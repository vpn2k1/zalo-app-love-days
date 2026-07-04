import { Modal } from "zmp-ui";
import type { ModalProps } from "zmp-ui/modal";

type Props = Omit<ModalProps, "mask" | "maskClosable"> & {
  mask?: ModalProps["mask"];
  maskClosable?: ModalProps["maskClosable"];
};

export function AppModal({
  mask = true,
  maskClosable = true,
  unmountOnClose = true,
  ...modalProps
}: Props) {
  return (
    <Modal
      {...modalProps}
      mask={mask}
      maskClosable={maskClosable}
      unmountOnClose={unmountOnClose}
    />
  );
}
