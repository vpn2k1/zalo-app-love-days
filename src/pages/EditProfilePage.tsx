import { useForm } from "react-hook-form";
import { Box, Button, Page, Text } from "zmp-ui";
import { AppDatePicker, AppTextInput } from "@/components/forms";
import type { AppUser } from "@/types/user";

type Props = {
  user: AppUser;
  startDate?: string;
  loading?: boolean;
  onSave: (payload: {
    display_name: string;
    custom_avatar_url: string | null;
    start_date: string;
  }) => Promise<void>;
  onBack: () => void;
};

export function EditProfilePage({ user, startDate, loading, onSave, onBack }: Props) {
  const { control, handleSubmit } = useForm<{
    display_name: string;
    custom_avatar_url: string;
    start_date: string;
  }>({
    defaultValues: {
      display_name: user.display_name || user.name,
      custom_avatar_url: user.custom_avatar_url || "",
      start_date: startDate || "",
    },
  });

  const submit = (values: {
    display_name: string;
    custom_avatar_url: string;
    start_date: string;
  }) =>
    onSave({
      display_name: values.display_name.trim(),
      custom_avatar_url: values.custom_avatar_url.trim() || null,
      start_date: values.start_date,
    });

  return (
    <Page className="love-page">
      <form onSubmit={handleSubmit(submit)}>
        <Box className="page-header">
          <Text className="overline">Hồ sơ</Text>
          <Text.Title size="large">Sửa profile</Text.Title>
        </Box>
        <Box className="soft-card form-stack">
          <AppTextInput
            control={control}
            name="display_name"
            label="Tên hiển thị"
          />
          <AppTextInput
            control={control}
            name="custom_avatar_url"
            label="Ảnh đại diện tuỳ chỉnh"
            placeholder="https://..."
          />
          <AppDatePicker control={control} name="start_date" label="Ngày bắt đầu" required />
        </Box>
        <Box className="bottom-action dual">
          <Button variant="secondary" onClick={onBack}>
            Quay lại
          </Button>
          <Button htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </Box>
      </form>
    </Page>
  );
}
