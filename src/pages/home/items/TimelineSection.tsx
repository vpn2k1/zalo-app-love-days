import { Box, Button, Icon, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  anniversaries: Anniversary[];
  onViewAll: () => void;
};

export function TimelineSection({ anniversaries, onViewAll }: Props) {
  if (anniversaries.length === 0) {
    return (
      <Box className="mb-3 rounded-[24px] border border-white/75 bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%)] bg-white/90 px-4 pb-4 pt-3 shadow-[0_16px_34px_rgba(84,49,72,0.08)]">
        <TimelineHeader onViewAll={onViewAll} />
        <Box className="flex min-h-[62px] items-center gap-3 rounded-[18px] bg-white/65 p-3">
          <Icon icon="zi-heart" className="text-[#e14d86]" />
          <Box className="min-w-0">
            <Text className="overflow-hidden text-ellipsis whitespace-nowrap font-[850] text-[#3a2232]">
              Chưa có kỷ niệm
            </Text>
            <Text className="text-xs leading-[1.35] text-[#8b6b7d]">
              Thêm ngày đầu tiên để lưu lại ở đây.
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mb-3 rounded-[24px] border border-white/75 bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%)] bg-white/90 px-4 pb-4 pt-3 shadow-[0_16px_34px_rgba(84,49,72,0.08)]">
      <TimelineHeader onViewAll={onViewAll} />
      <Box className="grid gap-2">
        {anniversaries.map((item) => (
          <TimelineItem item={item} key={item.id} />
        ))}
      </Box>
    </Box>
  );
}

function TimelineItem({ item }: { item: Anniversary }) {
  return (
    <Box className="flex min-h-[64px] items-center gap-3 rounded-[18px] bg-white/65 p-2.5">
      <TimelineThumb item={item} />
      <Box className="min-w-0 flex-1">
        <Box className="flex min-w-0 items-center gap-2">
          <Text className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-[850] text-[#3a2232]">
            {item.title}
          </Text>
          <Text className="flex-none rounded-full bg-[#fff0f6] px-2 py-1 text-[11px] font-bold text-[#d9467e]">
            {getRepeatLabel(item)}
          </Text>
        </Box>
        <Text className="mt-1 text-xs leading-[1.35] text-[#8b6b7d]">
          {formatDate(item.date)}
        </Text>
      </Box>
    </Box>
  );
}

function TimelineThumb({ item }: { item: Anniversary }) {
  if (item.image_url) {
    return (
      <img
        alt=""
        className="size-[46px] flex-none rounded-[16px] object-cover shadow-sm"
        src={item.image_url}
      />
    );
  }

  return (
    <Text className="grid size-[46px] flex-none place-items-center rounded-[16px] bg-[#fff0f6] text-[#e14d86]">
      ♡
    </Text>
  );
}

function TimelineHeader({ onViewAll }: { onViewAll: () => void }) {
  return (
    <Box className="mb-2.5 flex items-center justify-between">
      <Text.Title
        size="small"
        className="font-serif font-medium text-[#2f1d2a]"
      >
        Kỷ niệm gần đây
      </Text.Title>
      <Button
        className="min-h-8 rounded-full bg-transparent px-2.5 font-[850] text-[#e14d86]"
        htmlType="button"
        variant="tertiary"
        onClick={onViewAll}
      >
        Xem tất cả
      </Button>
    </Box>
  );
}

function getRepeatLabel(item: Anniversary) {
  if (item.repeat_type === "yearly") return "Hàng năm";

  return "Một lần";
}
