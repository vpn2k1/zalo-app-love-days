import type { KeyboardEvent } from "react";

import { AppSafeImage } from "@/components/AppSafeImage";
import { Box, Button, Icon } from "@/components/zaui";

type Props = {
  images: string[];
  label: string;
  onAdd: () => void;
  onOpen: (index: number) => void;
  onRemove: (index: number) => void;
  showAdd: boolean;
};

export function AppImageMultiPickerGrid({
  images,
  label,
  onAdd,
  onOpen,
  onRemove,
  showAdd,
}: Props) {
  return (
    <>
      {images.map((image, index) => (
        <ImageTile
          image={image}
          index={index}
          key={`${image}-${index}`}
          label={label}
          onOpen={onOpen}
          onRemove={onRemove}
        />
      ))}
      {showAdd && <AddImageTile onOpen={onAdd} />}
    </>
  );
}

type ImageTileProps = {
  image: string;
  index: number;
  label: string;
  onOpen: (index: number) => void;
  onRemove: (index: number) => void;
};

function ImageTile({
  image,
  index,
  label,
  onOpen,
  onRemove,
}: ImageTileProps) {
  const openByKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onOpen(index);
  };

  return (
    <Box className="relative aspect-square overflow-hidden rounded-[18px] border border-pink-100 bg-white shadow-sm">
      <Box
        aria-label={`Xem ảnh ${index + 1}`}
        className="size-full"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(index)}
        onKeyDown={openByKeyboard}
      >
        <AppSafeImage
          alt={label}
          className="size-full object-cover"
          fallback={<ImageTileFallback />}
          src={image}
        />
      </Box>
      <Box className="absolute right-1.5 top-1.5 flex gap-1">
        <TileIconButton
          icon="zi-close"
          label="Xóa ảnh"
          onClick={() => onRemove(index)}
        />
      </Box>
    </Box>
  );
}

function TileIconButton({
  icon,
  label,
  onClick,
}: {
  icon: "zi-close";
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      aria-label={label}
      className="!size-5 !min-h-5 !min-w-5 rounded-full flex items-center justify-center border border-dashed border-[#f5b6cd] bg-white/90 p-0 text-[#d9467e]"
      htmlType="button"
      icon={<Icon icon={icon} className="text-center" />}
      variant="tertiary"
      onClick={onClick}
    />
  );
}

function AddImageTile({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      aria-label="Thêm ảnh"
      className="aspect-square min-h-0 rounded-[18px] border border-dashed border-[#f5b6cd] bg-white/70 p-0 text-[#d9467e]"
      htmlType="button"
      variant="tertiary"
      onClick={onOpen}
      icon={<Icon icon="zi-add-photo" />}
    />
  );
}

function ImageTileFallback() {
  return (
    <Box className="grid size-full place-items-center bg-[#fff0f6] text-[#d9467e]">
      <Icon icon="zi-add-photo" className="text-2xl" />
    </Box>
  );
}
