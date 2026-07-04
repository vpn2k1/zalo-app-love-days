import { AppModal } from "@/components/zaui";

type Props = {
  conflictMessage?: string;
  loading?: boolean;
  onCloseConflict: () => Promise<void>;
};

export function InviteConflictModal({
  conflictMessage,
  loading,
  onCloseConflict,
}: Props) {
  return (
    <AppModal
      visible={Boolean(conflictMessage)}
      title="Bạn đã có Love Days rồi"
      description={getConflictDescription(conflictMessage)}
      maskClosable={false}
      actions={[
        {
          key: "close-conflict",
          text: "Đã hiểu",
          highLight: true,
          disabled: loading,
          onClick: onCloseConflict,
        },
      ]}
    />
  );
}

function getConflictDescription(conflictMessage?: string) {
  if (!conflictMessage) return undefined;

  return `${conflictMessage} Khi đóng thông báo, Love Days sẽ mở không gian hiện tại của bạn. Nếu tài khoản này chưa tạo không gian nào, app sẽ đưa bạn tới bước thiết lập ban đầu.`;
}
