import { Avatar, Box, Button, Icon } from "@/components/zaui";

type Props = {
  avatarSrc?: string;
  onPickAvatar: () => Promise<void>;
};

export function EditProfilePhoto({
  avatarSrc,
  onPickAvatar,
}: Props) {
  return (
    <>
      <Button
        htmlType="button"
        className="app-profile-photo"
        aria-label="Đổi ảnh đại diện"
        onClick={onPickAvatar}
      >
        <Avatar
          className="app-profile-photo-avatar"
          size={220}
          src={avatarSrc}
        >
          <Icon icon="zi-user" />
        </Avatar>
        <Box className="app-profile-photo-action">
          <Icon icon="zi-camera" /> Đổi ảnh
        </Box>
      </Button>
    </>
  );
}
