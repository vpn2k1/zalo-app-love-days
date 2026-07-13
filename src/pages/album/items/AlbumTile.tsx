import { AppSafeImage } from "@/components/AppSafeImage";
import { Box, Icon } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";

type Props = {
  item: Anniversary;
  onOpenImage: (item: Anniversary) => void;
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

function AlbumTileImage({ item }: { item: Anniversary }) {
  if (item.image_url) {
    return (
      <AppSafeImage
        alt={item.title}
        className="size-full object-cover"
        fallback={<AlbumTileFallback />}
        src={item.image_url}
      />
    );
  }

  return <AlbumTileFallback />;
}

function AlbumTileFallback() {
  return (
    <Box className="grid size-full place-items-center text-[#d9467e]">
      <Icon icon="zi-photo" className="text-xl" />
    </Box>
  );
}
