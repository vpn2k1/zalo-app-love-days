import { useFormContext } from "react-hook-form";
import { AppTextInput } from "@/components/forms";
import { Box } from "@/components/zaui";
import type { ProfileFormValues } from "../types/EditProfilePageType";

export function EditProfileFields() {
  const { control } = useFormContext<ProfileFormValues>();

  return (
    <Box className="app-setup-card">
      <Box className="app-setup-form">
        <AppTextInput
          control={control}
          name="display_name"
          label="Tên hiển thị"
        />
      </Box>
    </Box>
  );
}
