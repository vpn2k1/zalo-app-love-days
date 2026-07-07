import { useEffect, useRef } from "react";
import { Box, Icon, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  canLoadMore: boolean;
  items: Anniversary[];
  onLoadMore: () => void;
  onOpenMemory: (memoryId: string) => void;
};

export function AnniversariesPageList({
  canLoadMore,
  items,
  onLoadMore,
  onOpenMemory,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canLoadMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        onLoadMore();
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [canLoadMore, items.length, onLoadMore]);

  if (items.length === 0) {
    return (
      <Box className="rounded-[18px] bg-white/90 px-4 py-5 text-center">
        <Text className="font-[850] text-[#3a2232]">Không tìm thấy kỷ niệm</Text>
        <Text className="mt-1 text-xs leading-[1.35] text-[#8b6b7d]">
          Thử đổi từ khóa hoặc bộ lọc.
        </Text>
      </Box>
    );
  }

  return (
    <Box className="grid gap-2.5">
      {items.map((item) => (
        <AnniversaryRow
          item={item}
          key={item.id}
          onOpenMemory={onOpenMemory}
        />
      ))}
      {canLoadMore && (
        <div
          ref={sentinelRef}
          className="min-h-10 rounded-[18px] bg-white/70 py-2 text-center"
        >
          <Text className="text-xs font-bold text-[#8b6b7d]">
            Đang tải thêm...
          </Text>
        </div>
      )}
    </Box>
  );
}

function AnniversaryRow({
  item,
  onOpenMemory,
}: {
  item: Anniversary;
  onOpenMemory: (memoryId: string) => void;
}) {
  const openMemory = () => {
    onOpenMemory(item.id);
  };

  return (
    <Box
      className="flex min-h-[74px] items-center gap-3 rounded-[18px] bg-white/90 p-3"
      role="button"
      tabIndex={0}
      onClick={openMemory}
    >
      <AnniversaryThumb item={item} />
      <Box className="min-w-0 flex-1">
        <Text className="overflow-hidden text-ellipsis whitespace-nowrap font-[850] text-[#3a2232] line-clamp-1">
         {item.title}
        </Text>
        <Text className="text-xs leading-[1.35] text-[#8b6b7d]">
          {formatDate(item.date)} · {getRepeatLabel(item)}
        </Text>
        {item.note && (
          <Text className="mt-1 text-xs leading-[1.35] text-[#a45f7d]">
            {item.note}
          </Text>
        )}
      </Box>
    </Box>
  );
}

function AnniversaryThumb({ item }: { item: Anniversary }) {
  if (item.image_url) {
    return (
      <img
        alt=""
        className="size-[50px] flex-none rounded-[16px] object-cover"
        src={item.image_url}
      />
    );
  }

  return <Icon icon="zi-heart-solid" className="text-[var(--love-primary)]"/>
}

function getRepeatLabel(item: Anniversary) {
  if (item.repeat_type === "yearly") return "Hàng năm";

  return "Một lần";
}
