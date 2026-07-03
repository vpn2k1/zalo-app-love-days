import { useFieldArray, useForm } from "react-hook-form";
import { Box, Button, Page, Text } from "zmp-ui";
import { AnniversaryForm } from "@/components/AnniversaryForm";
import { AnniversaryList } from "@/components/AnniversaryList";
import { AppDatePicker, AppTextInput } from "@/components/forms";
import type { AnniversaryDraft } from "@/types/anniversary";
import type { SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { todayDateString } from "@/utils/date";

type Props = {
  user: AppUser;
  loading?: boolean;
  onCreate: (input: SetupCoupleInput) => Promise<void>;
};

type SetupFormValues = {
  startDate: string;
  displayName: string;
  anniversaries: AnniversaryDraft[];
};

export function SetupCouplePage({ user, loading, onCreate }: Props) {
  const { control, handleSubmit } = useForm<SetupFormValues>({
    defaultValues: {
      startDate: todayDateString(),
      displayName: user.display_name || user.name,
      anniversaries: [],
    },
  });
  const { append, fields } = useFieldArray({
    control,
    name: "anniversaries",
  });

  const submit = (values: SetupFormValues) =>
    onCreate({
      startDate: values.startDate,
      displayName: values.displayName.trim() || user.name,
      anniversaries: values.anniversaries,
    });

  return (
    <Page className="love-page">
      <Box className="page-header">
        <Text className="overline">Thiết lập</Text>
        <Text.Title size="large">Không gian của hai bạn</Text.Title>
        <Text className="subtle">
          Chọn ngày bắt đầu yêu và lưu vài cột mốc đáng nhớ.
        </Text>
      </Box>

      <Box className="soft-card form-stack">
        <AppDatePicker
          control={control}
          name="startDate"
          label="Ngày bắt đầu yêu"
          required
        />
        <AppTextInput
          control={control}
          name="displayName"
          label="Tên hiển thị của mình"
        />
      </Box>

      <Box className="soft-card">
        <AnniversaryForm onAdd={(draft) => append(draft)} />
        <AnniversaryList anniversaries={fields} />
      </Box>

      <Box className="bottom-action">
        <Button fullWidth loading={loading} onClick={handleSubmit(submit)}>
          Tạo Love Days
        </Button>
      </Box>
    </Page>
  );
}
