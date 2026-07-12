import { useFormContext, useWatch } from "react-hook-form";

import { AppSafeImage } from "@/components/AppSafeImage";
import { AppImagePicker } from "@/components/forms";
import { Box, Button, Icon, Text } from "@/components/zaui";
import { formatDate } from "@/utils/date";

import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

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
        <Box className="mt-4 rounded-[22px] border border-dashed border-[#f2a8c6] bg-[#fff7fb] p-5">
          <Box className="grid place-items-center gap-3 text-center">
            <Box className="grid size-14 place-items-center rounded-full bg-[#ffe4ef] text-[#d9467e]">
              <Icon icon="zi-plus" className="text-2xl" />
            </Box>
            <Box>
              <Text className="font-[850] text-[#3a2232]">
                Thêm ảnh kỷ niệm
              </Text>
              <Text className="mt-1 text-xs leading-[1.4] text-[#8b6b7d]">
                Một tấm ảnh sẽ làm ngày này dễ nhớ hơn.
              </Text>
            </Box>
            <AppImagePicker
              control={control}
              name="image_url"
              label="Ảnh kỷ niệm"
              customs={
                <Button
                  size="small"
                  variant="secondary"
                  className="rounded-2xl font-bold"
                >
                  Chọn ảnh
                </Button>
              }
            />
          </Box>
        </Box>
      );
    }

    return (
      <Box className="mt-4 grid gap-3">
        <Box
          className="relative block aspect-[4/3] w-full overflow-hidden rounded-[26px] border border-white bg-[#fff0f6] p-0 shadow-[0_18px_36px_rgba(134,45,83,0.16)]"
          onClick={onOpen}
        >
          <AppSafeImage
            alt="Ảnh mô tả kỷ niệm"
            className="size-full object-cover"
            fallback={<MemoryImageFallback />}
            src={imageUrl}
          />
          <Box className="absolute bottom-3 right-3 rounded-full bg-black/35 px-3 py-1.5 text-white backdrop-blur-md">
            <Text className="text-xs font-bold text-white">Xem ảnh</Text>
          </Box>
        </Box>
        <AppImagePicker
          control={control}
          name="image_url"
          label="Ảnh kỷ niệm"
          customs={
            <Button
              fullWidth
              size="small"
              variant="secondary"
              className="rounded-2xl font-bold"
            >
              <Box className="inline-flex items-center justify-center gap-1.5">
                <Icon icon="zi-photo" />
                Đổi ảnh
              </Box>
            </Button>
          }
        />
      </Box>
    );
  };

  return (
    <Box className="rounded-[28px] border border-pink-100 bg-white/90 p-4 shadow-[0_18px_42px_rgba(201,47,103,0.12)]">
      <Box className="flex items-start justify-between gap-3">
        <Box className="min-w-0 flex-1">
          <Text className="text-xs font-bold uppercase text-[#c45a86]">
            Kỷ niệm
          </Text>
          <Text.Title
            size="small"
            className="mt-1 font-serif leading-tight text-[#2f1d2a]"
          >
            {title}
          </Text.Title>
        </Box>
        <Box className="flex-none rounded-full bg-[#fff0f6] px-3 py-1.5">
          <Text className="text-xs font-bold text-[#8b6b7d]">
            {formatDate(date)}
          </Text>
        </Box>
      </Box>
      {renderButton()}
    </Box>
  );
}

function MemoryImageFallback() {
  return (
    <Box className="grid size-full place-items-center bg-[#fff7fb] text-[#d9467e]">
      <Icon icon="zi-photo" className="text-3xl" />
    </Box>
  );
}
