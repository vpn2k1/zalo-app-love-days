import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AppTextInput } from "@/components/forms";
import { useAppSnackbar } from "@/components/zaui";
import type { AppUser } from "@/types/user";
import { pickImagePath } from "@/utils/imagePicker";
import { Avatar, Box, Button, Icon, Text } from "zmp-ui";
import type { SetupFormValues } from "../types/SetupPageType";

type Props = {
  user: AppUser;
};

export function SetupPageAvatarPicker({ user }: Props) {
  const [editingName, setEditingName] = useState(false);
  const snackbar = useAppSnackbar();
  const { control, setValue } = useFormContext<SetupFormValues>();
  const displayName = useWatch({ control, name: "displayName" });
  const avatarUrl = useWatch({ control, name: "customAvatarUrl" });
  const avatarSrc = getAvatarSrc(avatarUrl);

  const pickAvatar = async () => {
    try {
      const image = await pickImagePath();
      if (image) setValue("customAvatarUrl", image, { shouldDirty: true });
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  return (
    <Box className="app-setup-card flex gap-4">
      <Box
        className="flex items-center justify-center relative"
        aria-label="Chọn ảnh đại diện"
        onClick={pickAvatar}
      >
        <Avatar size={94} src={avatarSrc}>
          <Icon icon="zi-user" />
        </Avatar>
        <Icon
          icon="zi-camera"
          className="bg-gray-300 absolute rounded-lg opacity-70"
          size={30}
        />
      </Box>
      <Box className="app-setup-user-copy">
        <Box className="app-setup-name-row">
          <NameControl
            control={control}
            displayName={displayName}
            editingName={editingName}
            setEditingName={setEditingName}
            user={user}
          />
        </Box>
        <Text className="app-opening-card-copy">
          Lấy từ Zalo sau khi bạn cấp quyền, vẫn có thể chỉnh trước khi lưu.
        </Text>
      </Box>
    </Box>
  );
}

type NameControlProps = {
  control: ReturnType<typeof useFormContext<SetupFormValues>>["control"];
  displayName: string;
  editingName: boolean;
  setEditingName: (value: boolean) => void;
  user: AppUser;
};

function NameControl({
  control,
  displayName,
  editingName,
  setEditingName,
  user,
}: NameControlProps) {
  if (editingName) {
    return (
      <Box className="flex items-center gap-2 cursor-pointer">
        <AppTextInput
          control={control}
          name="displayName"
          autoFocus
          onBlur={() => setEditingName(false)}
        />
        <Box onClick={() => setEditingName(false)} className="cursor-pointer">
          <Icon icon="zi-check" />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => setEditingName(true)}
    >
      <Text className="app-opening-card-title">
        {displayName.trim() || user.name}
      </Text>
      <Icon icon="zi-edit" />
    </Box>
  );
}

function getAvatarSrc(avatarUrl: string) {
  if (!avatarUrl) return undefined;
  return avatarUrl;
}
