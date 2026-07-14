import { useEffect, useRef, useState, type MutableRefObject } from "react";

import { AppImageViewer, Box, Text } from "@/components/zaui";
import { formatDate } from "@/utils/date";
import type { AlbumPhoto } from "../types/AlbumPageType";
import { AlbumTile } from "./AlbumTile";
import { AlbumViewerInfo } from "./AlbumViewerInfo";

type Props = {
  canLoadMore: boolean;
  items: AlbumPhoto[];
  onLoadMore: () => void;
};

export function AlbumPageGrid({
  canLoadMore,
  items,
  onLoadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerInfoExpanded, setViewerInfoExpanded] = useState(false);
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

  const openImage = (item: AlbumPhoto) => {
    const imageIndex = albumImages.findIndex((image) => image.id === item.id);
    if (imageIndex < 0) return;

    setViewerIndex(imageIndex);
    setViewerInfoExpanded(false);
    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerVisible(false);
  };
  const changeViewerIndex = (index: number) => {
    setViewerIndex(index);
    setViewerInfoExpanded(false);
  };
  const toggleViewerInfo = () => {
    setViewerInfoExpanded((current) => !current);
  };

  if (items.length === 0) {
    return <AlbumEmptyState canLoadMore={canLoadMore} sentinelRef={sentinelRef} />;
  }

  return (
    <Box>
      <Box className="grid grid-cols-3 gap-1.5">
        {items.map((item) => (
          <AlbumTile
            item={item}
            key={item.id}
            onOpenImage={openImage}
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
          onIndexChange={changeViewerIndex}
          renderOverlay={(image) => (
            <AlbumViewerInfo
              expanded={viewerInfoExpanded}
              image={image}
              onToggle={toggleViewerInfo}
            />
          )}
        />
      )}
    </Box>
  );
}

function getAlbumImages(items: AlbumPhoto[]) {
  return items.map((item) => ({
    alt: item.title,
    date: formatDate(item.date),
    description: item.description,
    id: item.id,
    src: item.imageUrl,
    title: item.title,
  }));
}

function AlbumEmptyState({
  canLoadMore,
  sentinelRef,
}: {
  canLoadMore: boolean;
  sentinelRef: MutableRefObject<HTMLDivElement | null>;
}) {
  return (
    <Box className="rounded-[18px] bg-white/90 px-4 py-5 text-center">
      <Text className="font-[850] text-[#3a2232]">Chưa có ảnh kỷ niệm</Text>
      <Text className="mt-1 text-xs leading-[1.35] text-[#8b6b7d]">
        Thêm ảnh khi tạo kỷ niệm để bộ ảnh hiện ở đây.
      </Text>
      {canLoadMore && (
        <div ref={sentinelRef} className="min-h-10 py-3">
          <Text className="text-xs font-bold text-[#8b6b7d]">
            Đang tìm thêm...
          </Text>
        </div>
      )}
    </Box>
  );
}
