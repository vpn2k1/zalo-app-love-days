import { useFormContext, useWatch } from "react-hook-form";
import { AppImagePicker } from "@/components/forms";
import { Box, Button, Text } from "@/components/zaui";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";
import { formatDate } from "@/utils/date";

type Props = {
  imageUrl?: string;
  onOpen: () => void;
};

export function MemoryImagePreview({ imageUrl, onOpen }: Props) {
  const { control } = useFormContext<MemoryDetailFormValues>();
  const title = useWatch({ name: "title", control, exact: true });
  const date = useWatch({ name: "date", control, exact: true });
  const renderButton = () => {
    if (!imageUrl) {
      return (
        <AppImagePicker
          control={control}
          name="image_url"
          label="Chưa có ảnh mô tả"
        />
      );
    }
    return (
      <Box>
        <Box
          className="block w-full overflow-hidden rounded-[22px] border-0 bg-transparent p-0"
          onClick={onOpen}
        >
          <img
            alt="Ảnh mô tả kỷ niệm"
            className="max-h-[60vh] w-full object-cover"
            src={"https://www.vecteezy.com/free-photos/image"}
          />
        </Box>
        <AppImagePicker
          control={control}
          name="image_url"
          label="Chưa có ảnh mô tả"
          customs={<Button className="w-full">Đổi ảnh</Button>}
        />
      </Box>
    );
  };
  return (
    <Box className="rounded-[24px] border border-[var(--love-border)] bg-white/85 p-3.5 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Text className="text-xs font-bold uppercase text-[#c45a86]">
        Chi tiết kỷ niệm
      </Text>
      <Text.Title size="small" className="mt-1 font-serif text-[#2f1d2a]">
        {title}
      </Text.Title>
      <Text className="mt-1 text-xs font-bold text-[#8b6b7d]">
        {formatDate(date)}
      </Text>
      {renderButton()}
    </Box>
  );
}
