import { AppSafeImage } from "@/components/AppSafeImage";
import { Box, Icon } from "@/components/zaui";
import type { AlbumPhoto } from "../types/AlbumPageType";

type Props = {
  item: AlbumPhoto;
  onOpenImage: (item: AlbumPhoto) => void;
};

export function AlbumTile({ item, onOpenImage }: Props) {
  const openImage = () => {
    onOpenImage(item);
  };

  return (
    <button
      type="button"
      className="relative aspect-square overflow-hidden rounded-[8px] bg-[#fff0f6] text-left active:scale-[0.98]"
      aria-label={`Xem ảnh ${item.title}`}
      onClick={openImage}
    >
      <AlbumTileImage item={item} />
    </button>
  );
}

function AlbumTileImage({ item }: { item: AlbumPhoto }) {
  return (
    <AppSafeImage
      alt={item.title}
      className="size-full object-cover"
      fallback={<AlbumTileFallback />}
      src={item.imageUrl}
    />
  );
}

function AlbumTileFallback() {
  return (
    <Box className="grid size-full place-items-center text-[#d9467e]">
      <Icon icon="zi-photo" className="text-xl" />
    </Box>
  );
}
