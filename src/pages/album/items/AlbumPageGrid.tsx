import { useEffect, useRef } from "react";

import { Box, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  canLoadMore: boolean;
  isRefreshing: boolean;
  items: Anniversary[];
  onLoadMore: () => void;
  onRefresh: () => void;
};

const REFRESH_DISTANCE = 72;

export function AlbumPageGrid({
  canLoadMore,
  isRefreshing,
  items,
  onLoadMore,
  onRefresh,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<number | null>(null);

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
          <AlbumCard item={item} key={item.id} />
        ))}
      </Box>
      {canLoadMore && (
        <div ref={sentinelRef} className="min-h-12 py-3 text-center">
          <Text className="text-xs font-bold text-[#8b6b7d]">
            Đang tải thêm...
          </Text>
        </div>
      )}
    </Box>
  );
}

function AlbumCard({ item }: { item: Anniversary }) {
  return (
    <Box className="min-w-0 overflow-hidden rounded-[18px] bg-white/90">
      <img
        alt={item.title}
        className="aspect-square w-full object-cover"
        src={item.image_url ?? ""}
      />
      <Box className="p-2.5">
        <Text className="text-[11px] font-bold leading-[1.25] text-[#8b6b7d]">
          {formatDate(item.date)}
        </Text>
        <Text className="mt-1 line-clamp-2 min-h-[34px] text-sm font-[850] leading-[1.2] text-[#3a2232]">
          {item.title}
        </Text>
      </Box>
    </Box>
  );
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
