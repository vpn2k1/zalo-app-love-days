import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Box, Button, Icon, Text } from "zmp-ui";
import { useImageViewerZoom } from "@/components/zaui/useImageViewerZoom";
import type { ImageType, ImageViewerProps } from "zmp-ui/image-viewer";

type Props = Omit<ImageViewerProps, "images"> & {
  images: ImageType[] | string[];
};

export function AppImageViewer({
  activeIndex = 0,
  images,
  visible,
  onClose,
}: Props) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const zoom = useImageViewerZoom();
  const image = normalizedImages[currentIndex];
  const hasMultipleImages = normalizedImages.length > 1;

  useEffect(() => {
    if (!visible) return;

    setCurrentIndex(getSafeIndex(activeIndex, normalizedImages.length));
    zoom.resetZoom();
  }, [activeIndex, normalizedImages.length, visible]);

  if (!visible) return null;
  if (!image) return null;

  const close = () => {
    zoom.resetZoom();
    onClose?.();
  };
  const previous = () => {
    setCurrentIndex((value) =>
      getPreviousIndex(value, normalizedImages.length),
    );
    zoom.resetZoom();
  };
  const next = () => {
    setCurrentIndex((value) => getNextIndex(value, normalizedImages.length));
    zoom.resetZoom();
  };

  return createPortal(
    <Box
      className="fixed inset-0 z-[9999] bg-black/95 text-white"
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Box className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <Button
          htmlType="button"
          variant="tertiary"
          className="pointer-events-auto !size-11 !min-h-11 !min-w-11 rounded-full bg-white/15 p-0 text-white backdrop-blur-md"
          icon={<Icon icon="zi-close" />}
          onClick={(event) => {
            event.stopPropagation();
            close();
          }}
        >
        </Button>
      </Box>

      <Box className="flex h-full w-full items-center justify-center px-3 pb-[calc(54px+env(safe-area-inset-bottom))] pt-[calc(58px+env(safe-area-inset-top))]">
        <Box
          className="flex size-full touch-none items-center justify-center overflow-hidden"
          onClick={zoom.toggleZoom}
          onPointerDown={zoom.handlePointerDown}
          onPointerMove={zoom.handlePointerMove}
          onPointerUp={zoom.handlePointerEnd}
          onPointerCancel={zoom.handlePointerEnd}
        >
          <img
            alt={image.alt ?? "Ảnh"}
            className="max-h-full max-w-full select-none object-contain transition-transform duration-150"
            draggable={false}
            src={image.src}
            style={{
              transform: `scale(${zoom.scale})`,
              transformOrigin: "center",
            }}
          />
        </Box>
      </Box>

      {hasMultipleImages && (
        <Box>
          <Button
            htmlType="button"
            variant="tertiary"
            className="absolute left-3 top-1/2 z-20 !size-11 !min-h-11 !min-w-11 -translate-y-1/2 rounded-full bg-white/15 p-0 text-white backdrop-blur-md"
            icon={<Icon icon="zi-chevron-left" />}
            onClick={(event) => {
              event.stopPropagation();
              previous();
            }}
          />
          <Button
            htmlType="button"
            variant="tertiary"
            className="absolute right-3 top-1/2 z-20 !size-11 !min-h-11 !min-w-11 -translate-y-1/2 rounded-full bg-white/15 p-0 text-white backdrop-blur-md"
            icon={<Icon icon="zi-chevron-right" />}
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
          />
        </Box>
      )}

      <Box className="pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-0 right-0 z-20 text-center">
        <Text className="text-sm font-bold text-white/80">
          {currentIndex + 1}/{normalizedImages.length}
        </Text>
      </Box>
    </Box>,
    document.body,
  );
}

function normalizeImages(images: Props["images"]): ImageType[] {
  return images.map((image) => {
    if (typeof image === "string") return { src: image };

    return image;
  });
}

function getSafeIndex(index: number, length: number) {
  if (length <= 0) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;

  return index;
}

function getPreviousIndex(index: number, length: number) {
  if (length <= 1) return index;
  if (index <= 0) return length - 1;

  return index - 1;
}

function getNextIndex(index: number, length: number) {
  if (length <= 1) return index;
  if (index >= length - 1) return 0;

  return index + 1;
}
