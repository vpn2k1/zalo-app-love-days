import { useFormContext } from "react-hook-form";
import {
  AppDatePicker,
  AppSelect,
  AppTextArea,
  AppTextInput,
} from "@/components/forms";
import { Box } from "@/components/zaui";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

export function MemoryDetailFields() {
  const { control } = useFormContext<MemoryDetailFormValues>();

  return (
    <Box className="grid gap-4">
      <AppTextInput
        control={control}
        name="title"
        label="Tên kỷ niệm"
        placeholder="Tên kỷ niệm"
        required
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
        label="Mô tả"
        placeholder="Một ghi chú nhỏ cho kỷ niệm này..."
      />
    </Box>
  );
}
