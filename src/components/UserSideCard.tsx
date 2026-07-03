import type { MouseEvent } from "react";
import { Avatar, Box, Button, Icon, Text } from "zmp-ui";
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
  user?.display_name || user?.name || "Love Days";

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

  return (
    <Box
      className="user-side-card"
      onClick={() => {
        if (!user && onEmptyAction) {
          handleEmptyAction();
        }
      }}
      role={!user && onEmptyAction ? "button" : undefined}
      tabIndex={!user && onEmptyAction ? 0 : undefined}
    >
      {user ? (
        <>
          {onAvatarClick ? (
            <button
              type="button"
              className="avatar-button"
              aria-label="Đổi ảnh đại diện"
              onClick={onAvatarClick}
            >
              {avatar}
            </button>
          ) : (
            avatar
          )}
          <div className="side-name-row">
            <Text className="side-name">{getDisplayName(user)}</Text>
            {onEditName && (
              <button
                type="button"
                className="icon-button mini-edit-button"
                aria-label="Sửa tên"
                onClick={onEditName}
              >
                <Icon icon="zi-edit" />
              </button>
            )}
          </div>
          <Text className="side-label">{label}</Text>
        </>
      ) : (
        <>
          <div className="avatar-placeholder">?</div>
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
