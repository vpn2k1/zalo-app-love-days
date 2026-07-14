import { type SyntheticEvent } from "react";
import { useFormContext } from "react-hook-form";

import {
  AppCalendarPicker,
  AppImageMultiPicker,
  AppSelect,
  AppTextArea,
  AppTextInput,
} from "@/components/forms";
import { Box, Text } from "@/components/zaui";

import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

type Props = {
  dateDisabled: boolean;
};

export function MemoryDetailFields({ dateDisabled }: Props) {
  const { control } = useFormContext<MemoryDetailFormValues>();
  const stopSheetEvent = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <Box
      className="rounded-[28px] border border-pink-100 bg-white/90 p-4 shadow-[0_14px_32px_rgba(201,47,103,0.08)]"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      onClick={stopSheetEvent}
      onPointerDown={stopSheetEvent}
      onTouchStart={stopSheetEvent}
    >
      <Box className="mb-4">
        <Text className="text-xs font-bold uppercase text-[#c45a86]">
          Thông tin chỉnh sửa
        </Text>
        <Text className="mt-1 text-xs leading-[1.4] text-[#8b6b7d]">
          Những thay đổi sẽ được lưu vào kỷ niệm của hai bạn.
        </Text>
      </Box>

      <Box
        className="grid gap-4"
        onClick={stopSheetEvent}
        onPointerDown={stopSheetEvent}
        onTouchStart={stopSheetEvent}
      >
        <AppImageMultiPicker
          control={control}
          name="image_urls"
          label="Ảnh kỷ niệm"
          maxCount={10}
          optional
          tileMinWidth={86}
        />
        <AppTextInput
          control={control}
          name="title"
          label="Tên kỷ niệm"
          placeholder="Tên kỷ niệm"
          required
        />
        <Box className="grid grid-cols-1 gap-4">
          <AppCalendarPicker
            control={control}
            disabled={dateDisabled}
            name="date"
            label="Ngày"
            required
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
        </Box>
        <AppTextArea
          control={control}
          name="note"
          label="Mô tả"
          placeholder="Một ghi chú nhỏ cho kỷ niệm này..."
        />
      </Box>
    </Box>
  );
}
