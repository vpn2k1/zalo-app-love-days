import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AppImageViewer, Avatar, Box, Button, Icon } from "@/components/zaui";
import { useAppSnackbar } from "@/components/zaui";
import { pickImagePath } from "@/utils/imagePicker";
import type { ProfileFormValues } from "../types/EditProfilePageType";

export function EditProfilePhoto() {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const snackbar = useAppSnackbar();
  const { control, setValue } = useFormContext<ProfileFormValues>();
  const avatarUrl = useWatch({
    control,
    name: "custom_avatar_url",
    exact: true,
  });

  const pickAvatar = async () => {
    try {
      const image = await pickImagePath();
      if (image) setValue("custom_avatar_url", image, { shouldDirty: true });
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const handleAvatarClick = () => {
    if (avatarUrl) {
      setShowImageViewer(true);
    }
  };

  return (
    <Box className="app-profile-photo" aria-label="Đổi ảnh đại diện">
      {/* <Avatar size={220} src={avatarUrl} onClick={handleAvatarClick}>
        <Icon icon="zi-user" />
      </Avatar> */}
      <img
        alt="avatar"
        className="absolute inset-0 size-full object-cover"
        src={avatarUrl}
        onClick={handleAvatarClick}
      />
      <Box onClick={pickAvatar} className="app-profile-photo-action">
        <Icon icon="zi-camera" /> Đổi ảnh
      </Box>

      {avatarUrl && (
        <AppImageViewer
          images={[{ src: avatarUrl, alt: "Ảnh đại diện" }]}
          visible={showImageViewer}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </Box>
  );
}
