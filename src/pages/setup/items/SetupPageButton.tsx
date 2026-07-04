import { useFormContext, useWatch } from "react-hook-form";
import { Box, Button, Text } from "zmp-ui";
import type { SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";
import type { SetupFormValues } from "../types/SetupPageType";
import { useCreateCoupleMutation } from "../modules/useCreateCoupleMutation";

type Props = {
  user: AppUser;
  loading?: boolean;
  onCreate: (input: SetupCoupleInput) => Promise<void>;
};

export function SetupPageButton({ loading, onCreate, user }: Props) {
  const { control, handleSubmit } = useFormContext<SetupFormValues>();
  const startDate = useWatch({ control, name: "startDate" });
  const canStart = Boolean(startDate);

  const submit = (values: SetupFormValues) => {
    if (!values.startDate) return;
    onCreate({
      startDate: values.startDate,
      displayName: values.displayName.trim() || user.name,
      customAvatarUrl: values.customAvatarUrl.trim() || null,
      backgroundUrl: values.backgroundUrl.trim() || null,
      anniversaries: values.anniversaries,
    });
  };

  return (
    <Box className="app-setup-action">
      <Button
        fullWidth
        disabled={!canStart}
        loading={loading}
        onClick={handleSubmit(submit)}
      >
        Bắt đầu đếm ngày
      </Button>
      <Text className="app-opening-note">
        Bạn có thể chỉnh lại mọi thứ sau ở hồ sơ.
      </Text>
    </Box>
  );
}
