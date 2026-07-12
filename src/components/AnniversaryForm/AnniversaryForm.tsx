import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  AppCalendarPicker,
  AppImagePicker,
  AppSelect,
  AppTextArea,
  AppTextInput,
} from "@/components/forms";
import { Box, Button } from "@/components/zaui";
import type { AnniversaryDraft } from "@/types/anniversary";

import {
  ANNIVERSARY_REPEAT_OPTIONS,
  getDefaultAnniversaryValues,
} from "./anniversaryFormDefaults";

type Props = {
  onAdd: (draft: AnniversaryDraft) => void | Promise<unknown>;
  loading?: boolean;
  close?: () => void;
  defaultDate?: string;
  lockDate?: boolean;
};

export function AnniversaryForm({
  onAdd,
  loading,
  close,
  defaultDate,
  lockDate,
}: Props) {
  const methods = useForm<AnniversaryDraft>({
    defaultValues: getDefaultAnniversaryValues(defaultDate),
  });
  const { control, handleSubmit, reset, watch } = methods;
  const title = watch("title");
  const date = watch("date");
  const canAdd = Boolean(title.trim() && date);

  useEffect(() => {
    reset(getDefaultAnniversaryValues(defaultDate));
  }, [defaultDate, reset]);

  const submit = async (values: AnniversaryDraft) => {
    if (!values.title.trim() || !values.date) return;

    await onAdd({
      ...values,
      title: values.title.trim(),
      note: values.note?.trim(),
      image_url: values.image_url?.trim(),
    });
    reset({
      ...getDefaultAnniversaryValues(defaultDate),
      repeat_type: values.repeat_type,
    });
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
          options={ANNIVERSARY_REPEAT_OPTIONS}
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
