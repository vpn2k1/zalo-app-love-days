import { useFormContext, useWatch } from "react-hook-form";
import { Avatar, Box, Button, Icon } from "@/components/zaui";
import { useAppSnackbar } from "@/components/zaui";
import { pickImagePath } from "@/utils/imagePicker";
import type { ProfileFormValues } from "../types/EditProfilePageType";

export function EditProfilePhoto() {
  const snackbar = useAppSnackbar();
  const { control, setValue } = useFormContext<ProfileFormValues>();
  const avatarUrl = useWatch({ control, name: "custom_avatar_url" });
  const avatarSrc = getAvatarSrc(avatarUrl);

  const pickAvatar = async () => {
    try {
      const image = await pickImagePath();
      if (image) setValue("custom_avatar_url", image, { shouldDirty: true });
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Button
        htmlType="button"
        className="app-profile-photo"
        aria-label="Đổi ảnh đại diện"
        onClick={pickAvatar}
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

function getAvatarSrc(avatarUrl: string) {
  if (!avatarUrl) return undefined;

  return avatarUrl;
}
