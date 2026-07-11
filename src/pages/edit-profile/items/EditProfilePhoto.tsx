import { useFormContext, useWatch } from "react-hook-form";

import { AppImagePicker } from "@/components/forms";
import { Avatar, Box, Icon } from "@/components/zaui";

import type { ProfileFormValues } from "../types/EditProfilePageType";

export function EditProfilePhoto() {
  const { control } = useFormContext<ProfileFormValues>();
  const avatarUrl = useWatch({
    control,
    name: "custom_avatar_url",
    exact: true,
  });

  return (
    <AppImagePicker
      control={control}
      name="custom_avatar_url"
      label="Thay ảnh"
      optional
      customs={
        <Box className="app-profile-photo" aria-label="Thay ảnh">
          <img
            className="app-profile-photo-avatar"
            src={getAvatarSrc(avatarUrl)}
          />
          <Box className="app-profile-photo-action">
            <Icon icon="zi-camera" /> Thay ảnh
          </Box>
        </Box>
      }
    />
  );
}

function getAvatarSrc(avatarUrl: string) {
  if (!avatarUrl) return undefined;

  return avatarUrl;
}
