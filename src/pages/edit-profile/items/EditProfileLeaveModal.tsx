import { AppModal } from "@/components/zaui";

type Props = {
  leaveLoading?: boolean;
  visible: boolean;
  onClose: () => void;
  onLeave: () => Promise<void>;
};

export function EditProfileLeaveModal({
  leaveLoading,
  visible,
  onClose,
  onLeave,
}: Props) {
  return (
    <AppModal
      visible={visible}
      title="Rời khỏi Yêu?"
      description="Thao tác này sẽ xoá dữ liệu cặp đôi, lời mời và các kỷ niệm đã lưu."
      maskClosable={!leaveLoading}
      onClose={onClose}
      actions={[
        {
          key: "cancel",
          text: "Huỷ",
          close: true,
        },
        {
          key: "confirm",
          text: "Xác nhận rời",
          danger: true,
          disabled: leaveLoading,
          onClick: onLeave,
        },
      ]}
    />
  );
}
