import { Avatar, Box, Button, Text } from "zmp-ui";
import type { AppUser } from "@/types/user";

type Props = {
  user?: AppUser;
  label: string;
  emptyLabel?: string;
  onEmptyAction?: () => void;
};

const getDisplayName = (user?: AppUser) =>
  user?.display_name || user?.name || "Love Days";

const getAvatar = (user?: AppUser) => user?.custom_avatar_url || user?.avatar_url;

export function UserSideCard({ user, label, emptyLabel, onEmptyAction }: Props) {
  return (
    <Box className="user-side-card">
      {user ? (
        <>
          <Avatar size={56} src={getAvatar(user) || undefined}>
            {getDisplayName(user).slice(0, 1).toUpperCase()}
          </Avatar>
          <Text className="side-name">{getDisplayName(user)}</Text>
          <Text className="side-label">{label}</Text>
        </>
      ) : (
        <>
          <div className="avatar-placeholder">?</div>
          <Text className="side-name muted">Chưa kết nối</Text>
          <Text className="side-label">{label}</Text>
          {onEmptyAction && (
            <Button size="small" className="soft-button" onClick={onEmptyAction}>
              {emptyLabel || "Thêm"}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
