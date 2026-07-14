import { AppModal } from "@/components/zaui";

type Props = {
  loading: boolean;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function MemoryDeleteConfirmModal({
  loading,
  visible,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AppModal
      visible={visible}
      title="Xoá kỷ niệm này?"
      description="Kỷ niệm sẽ bị xoá khỏi không gian của hai bạn."
      maskClosable={!loading}
      onClose={onClose}
      actions={[
        {
          key: "cancel",
          text: "Hủy",
          close: true,
        },
        {
          key: "confirm",
          text: "Xác nhận xoá",
          danger: true,
          disabled: loading,
          onClick: onConfirm,
        },
      ]}
    />
  );
}
