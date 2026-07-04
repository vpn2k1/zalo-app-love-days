import { Box, Icon, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  anniversaries: Anniversary[];
};

export function TimelineSection({ anniversaries }: Props) {
  if (anniversaries.length === 0) {
    return (
      <Box className="mb-3 rounded-[18px] bg-white/90 px-3.5 pb-3.5 pt-2.5">
        <TimelineHeader />
        <Box className="flex min-h-10 items-center gap-3">
          <Text className="grid size-[30px] flex-none place-items-center rounded-[11px] bg-[#fff0f6] text-[#e14d86]">
            ♡
          </Text>
          <Box>
            <Text className="font-[850] text-[#3a2232]">Beach sunset</Text>
            <Text className="text-xs leading-[1.35] text-[#8b6b7d]">12 photos</Text>
          </Box>
          <Text className="grid size-[30px] flex-none place-items-center rounded-[11px] bg-[#fff0f6] text-[#e14d86]">
            ✦
          </Text>
          <Box>
            <Text className="font-[850] text-[#3a2232]">Coffee date</Text>
            <Text className="text-xs leading-[1.35] text-[#8b6b7d]">5 photos</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="mb-3 rounded-[18px] bg-white/90 px-3.5 pb-3.5 pt-2.5">
      <TimelineHeader />
      {anniversaries.map((item) => (
        <Box className="flex min-h-10 items-center gap-3" key={item.id}>
          <Text className="grid size-[30px] flex-none place-items-center rounded-[11px] bg-[#fff0f6] text-[#e14d86]">
            ♡
          </Text>
          <Box>
            <Text className="font-[850] text-[#3a2232]">{item.title}</Text>
            <Text className="text-xs leading-[1.35] text-[#8b6b7d]">
              {formatDate(item.date)}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function TimelineHeader() {
  return (
    <Box className="mb-2.5 flex items-center justify-between">
      <Text.Title
        size="small"
        className="font-serif font-medium text-[#2f1d2a]"
      >
        Photo album timeline
      </Text.Title>
      <Icon icon="zi-chevron-right" />
    </Box>
  );
}
