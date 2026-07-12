import { AppModal } from "@/components/zaui";

type Props = {
  leaveLoading?: boolean;
  memberCount: number;
  visible: boolean;
  onClose: () => void;
  onLeave: () => Promise<void>;
};

export function EditProfileLeaveModal({
  leaveLoading,
  memberCount,
  visible,
  onClose,
  onLeave,
}: Props) {
  return (
    <AppModal
      visible={visible}
      title={getTitle(memberCount)}
      description={getDescription(memberCount)}
      maskClosable={!leaveLoading}
      onClose={onClose}
      actions={[
        {
          key: "cancel",
          text: "Hủy",
          close: true,
        },
        {
          key: "confirm",
          text: getConfirmText(memberCount),
          danger: true,
          disabled: leaveLoading,
          onClick: onLeave,
        },
      ]}
    />
  );
}

function getTitle(memberCount: number) {
  if (memberCount <= 1) return "Xóa không gian này?";

  return "Rời khỏi không gian?";
}

function getDescription(memberCount: number) {
  if (memberCount <= 1) {
    return "Bạn là người cuối cùng trong không gian. Khi xác nhận, app sẽ xóa ảnh đã lưu, kỷ niệm, lời mời, thành viên, không gian này và hồ sơ của bạn.";
  }

  return "Bạn sẽ rời khỏi không gian này. App sẽ xóa hồ sơ của bạn và liên kết thành viên của bạn, nhưng vẫn giữ không gian, kỷ niệm, lời mời và ảnh chung cho người còn lại.";
}

function getConfirmText(memberCount: number) {
  if (memberCount <= 1) return "Xác nhận xóa";

  return "Xác nhận rời";
}
