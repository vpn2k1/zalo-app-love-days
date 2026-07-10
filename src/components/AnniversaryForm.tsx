import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AppCalendarPicker,
  AppImagePicker,
  AppSelect,
  AppTextArea,
  AppTextInput,
} from "@/components/forms";
import { Box, Button, Text } from "@/components/zaui";
import type { AnniversaryDraft } from "@/types/anniversary";

type Props = {
  onAdd: (draft: AnniversaryDraft) => void | Promise<unknown>;
  loading?: boolean;
  close?: () => void;
  defaultDate?: string;
  lockDate?: boolean;
};

function getDefaultValues(defaultDate = ""): AnniversaryDraft {
  return {
    title: "",
    date: defaultDate,
    repeat_type: "yearly",
    note: "",
    image_url: "",
  };
}

export function AnniversaryForm({
  onAdd,
  loading,
  close,
  defaultDate,
  lockDate,
}: Props) {
  const methods = useForm<AnniversaryDraft>({
    defaultValues: getDefaultValues(defaultDate),
  });
  const { control, handleSubmit, reset, watch } = methods;
  const title = watch("title");
  const date = watch("date");
  const canAdd = Boolean(title.trim() && date);

  useEffect(() => {
    reset(getDefaultValues(defaultDate));
  }, [defaultDate, reset]);

  const submit = async (values: AnniversaryDraft) => {
    if (!values.title.trim() || !values.date) return;
    await onAdd({
      ...values,
      title: values.title.trim(),
      note: values.note?.trim(),
      image_url: values.image_url?.trim(),
    });
    reset({ ...getDefaultValues(defaultDate), repeat_type: values.repeat_type });
    close?.();
  };

  return (
    <FormProvider {...methods}>
      <Box className="anniversary-form p-4">
        <AppTextInput
          control={control}
          name="title"
          label="Tên kỷ niệm"
          placeholder="Ví dụ: Lần đầu gặp nhau"
        />
        <AppCalendarPicker
          control={control}
          name="date"
          label="Ngày"
          required
          disabled={lockDate}
        />
        <AppImagePicker
          control={control}
          name="image_url"
          label="Ảnh kỷ niệm"
          optional
        />
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
        <Button
          fullWidth
          disabled={!canAdd}
          htmlType="button"
          variant="secondary"
          loading={loading}
          onClick={handleSubmit(submit)}
        >
          Thêm ngày kỷ niệm
        </Button>
      </Box>
    </FormProvider>
  );
}
