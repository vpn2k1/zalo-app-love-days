import type { MouseEvent } from "react";
import { Avatar, Box, Button, Icon, Text } from "@/components/zaui";
import type { AppUser } from "@/types/user";

type Props = {
  user?: AppUser;
  label: string;
  emptyLabel?: string;
  onEmptyAction?: () => void;
  onAvatarClick?: () => void;
  onEditName?: () => void;
};

const getDisplayName = (user?: AppUser) =>
  user?.display_name || user?.name || "Nhật ký tình yêu";

const getAvatar = (user?: AppUser) => user?.custom_avatar_url || user?.avatar_url;

export function UserSideCard({
  user,
  label,
  emptyLabel,
  onEmptyAction,
  onAvatarClick,
  onEditName,
}: Props) {
  const handleEmptyAction = (event?: MouseEvent) => {
    event?.stopPropagation();
    onEmptyAction?.();
  };
  const avatar = (
    <Avatar size={56} src={getAvatar(user) || undefined}>
      {getDisplayName(user).slice(0, 1).toUpperCase()}
    </Avatar>
  );
  let emptyActionRole;
  let emptyActionTabIndex;
  if (!user && onEmptyAction) {
    emptyActionRole = "button";
    emptyActionTabIndex = 0;
  }

  return (
    <Box
      className="user-side-card"
      onClick={() => {
        if (!user && onEmptyAction) {
          handleEmptyAction();
        }
      }}
      role={emptyActionRole}
      tabIndex={emptyActionTabIndex}
    >
      {user ? (
        <>
          {onAvatarClick ? (
            <Button
              htmlType="button"
              className="avatar-button"
              aria-label="Đổi ảnh đại diện"
              onClick={onAvatarClick}
            >
              {avatar}
            </Button>
          ) : (
            avatar
          )}
          <Box className="side-name-row">
            <Text className="side-name">{getDisplayName(user)}</Text>
            {onEditName && (
              <Button
                htmlType="button"
                className="icon-button mini-edit-button"
                aria-label="Sửa tên"
                onClick={onEditName}
              >
                <Icon icon="zi-edit" />
              </Button>
            )}
          </Box>
          <Text className="side-label">{label}</Text>
        </>
      ) : (
        <>
          <Box className="avatar-placeholder">?</Box>
          <Text className="side-name muted">Chưa kết nối</Text>
          <Text className="side-label">{label}</Text>
          {onEmptyAction && (
            <Button
              size="small"
              className="soft-button"
              onClick={(event) => handleEmptyAction(event)}
            >
              {emptyLabel || "Thêm"}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
