import { useFormContext } from "react-hook-form";
import { AppImagePicker } from "@/components/forms";
import { Box, Text } from "@/components/zaui";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

type Props = {
  imageUrl?: string;
  onOpen: () => void;
};

export function MemoryImagePreview({ imageUrl, onOpen }: Props) {
  const { control } = useFormContext<MemoryDetailFormValues>();

  if (!imageUrl) {
    return (
      <Box className="grid gap-3">
        <Box className="grid min-h-[180px] place-items-center rounded-[22px] bg-white/80 text-center">
          <Text className="text-sm font-bold text-[#8b6b7d]">
            Chưa có ảnh mô tả
          </Text>
        </Box>
        <AppImagePicker
          control={control}
          name="image_url"
          label="Đổi ảnh"
          optional
        />
      </Box>
    );
  }

  return (
    <Box className="grid gap-3">
      <button
        className="block w-full overflow-hidden rounded-[22px] border-0 bg-transparent p-0"
        type="button"
        onClick={onOpen}
      >
        <img
          alt="Ảnh mô tả kỷ niệm"
          className="max-h-[60vh] w-full object-cover"
          src={imageUrl}
        />
      </button>
      <AppImagePicker
        control={control}
        name="image_url"
        label="Đổi ảnh"
        optional
      />
    </Box>
  );
}
