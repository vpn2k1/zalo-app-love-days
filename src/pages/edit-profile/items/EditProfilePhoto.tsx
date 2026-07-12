import { useFormContext, useWatch } from "react-hook-form";

import { AppSafeImage } from "@/components/AppSafeImage";
import { AppImagePicker } from "@/components/forms";
import { Box, Icon } from "@/components/zaui";

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
          <AppSafeImage
            className="app-profile-photo-avatar"
            fallback={<ProfilePhotoFallback />}
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

function ProfilePhotoFallback() {
  return (
    <Box className="app-profile-photo-avatar grid place-items-center bg-[#fff0f6] text-[#d9467e]">
      <Icon icon="zi-user" />
    </Box>
  );
}

function getAvatarSrc(avatarUrl: string) {
  if (!avatarUrl) return undefined;

  return avatarUrl;
}
