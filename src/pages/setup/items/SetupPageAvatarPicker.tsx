import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Avatar, Box, Icon, Text } from "zmp-ui";

import { AppImagePicker, AppTextInput } from "@/components/forms";
import type { AppUser } from "@/types/user";

import type { SetupFormValues } from "../types/SetupPageType";

type Props = {
  user: AppUser;
};

export function SetupPageAvatarPicker({ user }: Props) {
  const [editingName, setEditingName] = useState(false);
  const { control } = useFormContext<SetupFormValues>();
  const displayName = useWatch({ control, name: "displayName" });
  const avatarUrl = useWatch({ control, name: "customAvatarUrl" });

  return (
    <Box className="app-setup-card flex gap-4">
      <AppImagePicker
        control={control}
        name="customAvatarUrl"
        label="áº¢nh Ä‘áº¡i diá»‡n"
        optional
        customs={(
          <Box className="relative flex items-center justify-center">
            <Avatar size={80} src={getAvatarSrc(avatarUrl)}>
              <Icon icon="zi-user" />
            </Avatar>
            <Icon
              icon="zi-camera"
              className="absolute rounded-full bg-gray-300 opacity-60"
              size={30}
            />
          </Box>
        )}
      />
      <Box className="app-setup-user-copy">
        <NameControl
          control={control}
          displayName={displayName}
          editingName={editingName}
          setEditingName={setEditingName}
          user={user}
        />
        <Text className="app-opening-card-copy">Báº¡n cÃ³ thá»ƒ chá»‰nh sá»­a sau.</Text>
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
      <Box className="flex cursor-pointer items-center gap-2">
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
      className="flex cursor-pointer items-center gap-2"
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
