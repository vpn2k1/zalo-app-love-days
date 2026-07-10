import { useEffect, useRef, useState } from "react";

import { AppImageViewer } from "@/components/zaui";
import { Box, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";

import { AlbumCard } from "./AlbumCard";

type Props = {
  canLoadMore: boolean;
  isRefreshing: boolean;
  items: Anniversary[];
  onLoadMore: () => void;
  onOpenMemory: (memoryId: string) => void;
  onRefresh: () => void;
};

const REFRESH_DISTANCE = 72;

export function AlbumPageGrid({
  canLoadMore,
  isRefreshing,
  items,
  onLoadMore,
  onOpenMemory,
  onRefresh,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const albumImages = getAlbumImages(items);

  useEffect(() => {
    if (!canLoadMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        onLoadMore();
      },
      { rootMargin: "180px 0px" },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [canLoadMore, items.length, onLoadMore]);

  const startTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    if (window.scrollY > 0) return;

    touchStartRef.current = event.touches[0]?.clientY ?? null;
  };

  const endTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (start === null) return;
    if (isRefreshing) return;
    if (event.changedTouches[0]?.clientY - start < REFRESH_DISTANCE) return;

    onRefresh();
  };
  const openImage = (item: Anniversary) => {
    if (!item.image_url) return;

    const imageIndex = albumImages.findIndex((image) => image.id === item.id);
    if (imageIndex < 0) return;

    setViewerIndex(imageIndex);
    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerVisible(false);
  };

  if (items.length === 0) return <AlbumEmptyState />;

  return (
    <Box onTouchStart={startTouch} onTouchEnd={endTouch}>
      {isRefreshing && (
        <Text className="mb-2 text-center text-xs font-bold text-[#8b6b7d]">
          Đang làm mới...
        </Text>
      )}
      <Box className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <AlbumCard
            item={item}
            key={item.id}
            onOpenImage={openImage}
            onOpenMemory={onOpenMemory}
          />
        ))}
      </Box>
      {canLoadMore && (
        <div ref={sentinelRef} className="min-h-12 py-3 text-center">
          <Text className="text-xs font-bold text-[#8b6b7d]">
            Đang tải thêm...
          </Text>
        </div>
      )}
      {albumImages.length > 0 && (
        <AppImageViewer
          activeIndex={viewerIndex}
          images={albumImages}
          visible={viewerVisible}
          onClose={closeViewer}
        />
      )}
    </Box>
  );
}

function getAlbumImages(items: Anniversary[]) {
  return items
    .filter((item) => Boolean(item.image_url))
    .map((item) => ({
      alt: item.title,
      id: item.id,
      src: item.image_url ?? "",
    }));
}

function AlbumEmptyState() {
  return (
    <Box className="rounded-[18px] bg-white/90 px-4 py-5 text-center">
      <Text className="font-[850] text-[#3a2232]">Chưa có ảnh kỷ niệm</Text>
      <Text className="mt-1 text-xs leading-[1.35] text-[#8b6b7d]">
        Thêm ảnh khi tạo kỷ niệm để bộ ảnh hiện ở đây.
      </Text>
    </Box>
  );
}
