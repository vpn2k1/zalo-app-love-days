import { AppSafeImage } from "@/components/AppSafeImage";
import { Box, Button, Icon, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  item: Anniversary;
  onOpenImage: (item: Anniversary) => void;
  onOpenMemory: (memoryId: string) => void;
};

export function AlbumCard({ item, onOpenImage, onOpenMemory }: Props) {
  const openMemory = () => {
    onOpenMemory(item.id);
  };
  const openImage = () => {
    onOpenImage(item);
  };

  return (
    <Box className="min-w-0 overflow-hidden rounded-[22px] border border-pink-100 bg-white/90 shadow-[0_12px_26px_rgba(201,47,103,0.1)]">
      <button
        type="button"
        className="relative block aspect-square w-full overflow-hidden bg-[#fff0f6]"
        onClick={openImage}
      >
        <AlbumImage item={item} />
        {item.image_url && (
          <Box className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/35 text-white backdrop-blur-md">
            <Icon icon="zi-photo" />
          </Box>
        )}
      </button>

      <Box className="p-3">
        <Box className="mb-2 inline-flex rounded-full bg-[#fff0f6] px-2.5 py-1">
          <Text className="text-[11px] font-bold leading-[1.25] text-[#8b6b7d]">
            {formatDate(item.date)}
          </Text>
        </Box>
        <Text className="line-clamp-2 min-h-[36px] text-sm font-[850] leading-[1.25] text-[#3a2232]">
          {item.title}
        </Text>
        <Button
          fullWidth
          size="small"
          variant="tertiary"
          className="mt-2 rounded-2xl bg-[#fff7fb] text-xs font-bold text-[#d9467e]"
          onClick={openMemory}
        >
          Chi tiết
        </Button>
      </Box>
    </Box>
  );
}

function AlbumImage({ item }: { item: Anniversary }) {
  if (item.image_url) {
    return (
      <AppSafeImage
        alt={item.title}
        className="size-full object-cover transition duration-200 active:scale-[1.02]"
        fallback={<AlbumImageFallback />}
        src={item.image_url}
      />
    );
  }

  return <AlbumImageFallback />;
}

function AlbumImageFallback() {
  return (
    <Box className="grid size-full place-items-center p-4 text-center">
      <Box className="grid place-items-center gap-2">
        <Box className="grid size-12 place-items-center rounded-full bg-[#ffe4ef] text-[#d9467e]">
          <Icon icon="zi-photo" className="text-xl" />
        </Box>
        <Text className="text-xs font-bold leading-[1.35] text-[#8b6b7d]">
          Chưa có ảnh
        </Text>
      </Box>
    </Box>
  );
}
