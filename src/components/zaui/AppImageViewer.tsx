import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Box, Button, Icon, Text } from "zmp-ui";

import { AppSafeImage } from "@/components/AppSafeImage";
import { AppImageViewerSaveButton } from "@/components/zaui/AppImageViewerSaveButton";
import { useImageViewerZoom } from "@/components/zaui/useImageViewerZoom";
import { useOverlayBackClose } from "@/components/zaui/useOverlayBackClose";
import type { ImageType, ImageViewerProps } from "zmp-ui/image-viewer";

export type AppImageViewerImage = ImageType & {
  date?: string;
  description?: string | null;
  title?: string;
};

type Props = Omit<ImageViewerProps, "images"> & {
  images: AppImageViewerImage[] | string[];
  onIndexChange?: (index: number) => void;
  renderOverlay?: (
    image: AppImageViewerImage,
    index: number,
    total: number,
  ) => ReactNode;
};

export function AppImageViewer({
  activeIndex = 0,
  images,
  onIndexChange,
  renderOverlay,
  visible,
  onClose,
}: Props) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const zoom = useImageViewerZoom();
  const image = normalizedImages[currentIndex];
  const hasMultipleImages = normalizedImages.length > 1;
  const close = () => {
    zoom.resetZoom();
    onClose?.();
  };

  useEffect(() => {
    if (!visible) return;

    setCurrentIndex(getSafeIndex(activeIndex, normalizedImages.length));
    zoom.resetZoom();
  }, [activeIndex, normalizedImages.length, visible]);

  useOverlayBackClose(visible, close);

  if (!visible) return null;
  if (!image) return null;

  const previous = () => {
    setImageIndex(getPreviousIndex(currentIndex, normalizedImages.length));
    zoom.resetZoom();
  };
  const next = () => {
    setImageIndex(getNextIndex(currentIndex, normalizedImages.length));
    zoom.resetZoom();
  };
  const setImageIndex = (index: number) => {
    setCurrentIndex(index);
    onIndexChange?.(index);
  };

  return createPortal(
    <Box
      className="fixed inset-0 z-[9999] bg-black/95 text-white"
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Box className="pointer-events-none absolute left-0 right-0 top-2 z-30 flex items-center gap-2 px-4 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
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
        <AppImageViewerSaveButton imageUrl={image.src} />
      </Box>

      <Box className="flex h-full w-full items-center justify-center px-3 pb-[calc(54px+env(safe-area-inset-bottom))] pt-[calc(58px+env(safe-area-inset-top))]">
        <Box
          className="flex size-full touch-none items-center justify-center overflow-hidden rounded-2xl"
          onClick={zoom.toggleZoom}
          onPointerDown={zoom.handlePointerDown}
          onPointerMove={zoom.handlePointerMove}
          onPointerUp={zoom.handlePointerEnd}
          onPointerCancel={zoom.handlePointerEnd}
        >
          <AppSafeImage
            alt={image.alt ?? "Ảnh"}
            className="select-none size-full rounded-lg object-contain"
            draggable={false}
            fallback={<ImageViewerFallback />}
            src={image.src}
            style={{
              transform: `translate3d(${zoom.position.x}px, ${zoom.position.y}px, 0) scale(${zoom.scale})`,
              transformOrigin: "center",
              willChange: "transform",
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

      <Box className={getCounterClassName(Boolean(renderOverlay))}>
        <Text className="text-sm font-bold text-white/80">
          {currentIndex + 1}/{normalizedImages.length}
        </Text>
      </Box>
      {renderOverlay?.(image, currentIndex, normalizedImages.length)}
    </Box>,
    document.body,
  );
}

function ImageViewerFallback() {
  return (
    <Box className="grid size-full place-items-center text-white/70">
      <Icon icon="zi-photo" className="text-4xl" />
    </Box>
  );
}

function normalizeImages(images: Props["images"]): AppImageViewerImage[] {
  return images.map((image) => {
    if (typeof image === "string") return { src: image };

    return image;
  });
}

function getCounterClassName(hasOverlay: boolean) {
  if (hasOverlay) {
    return "pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] right-4 z-20 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-md";
  }

  return "pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-0 right-0 z-20 text-center";
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
