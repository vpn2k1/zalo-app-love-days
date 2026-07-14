import type { KeyboardEvent } from "react";

import { Box, Button, Text } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import type { Anniversary } from "@/types/anniversary";

type Props = {
  anniversaries: Anniversary[];
};

export function TodayAnniversaryCard({ anniversaries }: Props) {
  const navigation = useAppNavigation();
  const anniversary = anniversaries[0];
  if (!anniversary) return null;

  const openDetail = () => {
    navigation.goMemory(anniversary.id);
  };
  const openDetailByKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openDetail();
  };

  return (
    <Box
      aria-label={`Mở kỷ niệm ${anniversary.title}`}
      className="mb-3 overflow-hidden rounded-[24px] border border-white/75 bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%)] bg-white/85 p-4 shadow-[0_16px_34px_rgba(84,49,72,0.1)]"
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={openDetailByKeyboard}
    >
      <Text className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#c45a86]">
        Hôm nay là ngày kỷ niệm
      </Text>
      <Box className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Box className="min-w-0 flex-1">
          <Text className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[20px] font-[900] leading-tight text-[#2f1d2a]">
            {anniversary.title}
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-wrap items-center justify-between gap-2 rounded-[18px] bg-white/60 ">
        <Text className="min-w-0 text-[13px] font-bold text-[#716773] px-3">
          Cùng ôn lại nào
        </Text>
        <Button
          className="min-h-8 rounded-full px-3 text-[12px] font-[850] text-[#d9467e]"
          htmlType="button"
          size="small"
          variant="tertiary"
        >
          Mở chi tiết
        </Button>
      </Box>
    </Box>
  );
}
