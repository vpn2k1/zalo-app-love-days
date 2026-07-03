import { useForm } from "react-hook-form";
import { Button, Text } from "zmp-ui";
import {
  AppDatePicker,
  AppSelect,
  AppTextArea,
  AppTextInput,
} from "@/components/forms";
import type { AnniversaryDraft } from "@/types/anniversary";
import { todayDateString } from "@/utils/date";

type Props = {
  onAdd: (draft: AnniversaryDraft) => void | Promise<void>;
  loading?: boolean;
};

export function AnniversaryForm({ onAdd, loading }: Props) {
  const { control, handleSubmit, reset } = useForm<AnniversaryDraft>({
    defaultValues: {
      title: "",
      date: todayDateString(),
      repeat_type: "yearly",
      note: "",
    },
  });

  const submit = async (values: AnniversaryDraft) => {
    if (!values.title.trim() || !values.date) return;
    await onAdd({ ...values, title: values.title.trim(), note: values.note?.trim() });
    reset({
      title: "",
      date: values.date,
      repeat_type: values.repeat_type,
      note: "",
    });
  };

  return (
    <form className="anniversary-form" onSubmit={handleSubmit(submit)}>
      <Text className="form-label">Ngày kỷ niệm</Text>
      <AppTextInput
        control={control}
        name="title"
        label="Tên kỷ niệm"
        placeholder="Ví dụ: Lần đầu gặp nhau"
      />
      <AppDatePicker control={control} name="date" label="Ngày" required />
      <AppSelect
        control={control}
        name="repeat_type"
        label="Lặp lại"
        options={[
          { label: "Hàng năm", value: "yearly" },
          { label: "Không lặp", value: "none" },
        ]}
      />
      <AppTextArea
        control={control}
        name="note"
        label="Ghi chú"
        placeholder="Một lời nhắn nhỏ..."
      />
      <Button fullWidth htmlType="submit" variant="secondary" loading={loading}>
        Thêm ngày kỷ niệm
      </Button>
    </form>
  );
}
