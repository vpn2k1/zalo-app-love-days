import { Box, Button, Text } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import type { UpcomingAnniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  nextAnniversary: UpcomingAnniversary | null;
};

export function MemoryGardenSection({
  nextAnniversary,
}: Props) {
  const navigation = useAppNavigation();
  return (
    <Box className="mb-3 overflow-hidden rounded-[24px] border border-white/75 bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%)] bg-white/85 p-4 shadow-[0_16px_34px_rgba(84,49,72,0.1)]">
      <Text className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-[#c45a86]">
        Ngày kỷ niệm sắp tới
      </Text>
      <Box className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Box className="min-w-0 flex-1">
          <Text className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[20px] font-[900] leading-tight text-[#2f1d2a]">
            {getNextAnniversaryTitle(nextAnniversary)}
          </Text>
        </Box>
        <Box className="grid min-w-[76px] flex-none place-items-center rounded-[20px] bg-white/80 px-2 py-2 text-center shadow-sm">
          <Text className="text-[clamp(20px,7vw,24px)] font-[900] leading-none text-[#d9467e]">
            {getDaysLeft(nextAnniversary)}
          </Text>
          <Text className="mt-1 text-[11px] font-bold text-[#9b6b82]">
            ngày nữa
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-wrap items-center justify-between gap-2 rounded-[18px] bg-white/60 px-3 py-2">
        <Text className="min-w-0 text-[13px] font-bold text-[#716773]">
          {getNextAnniversaryDate(nextAnniversary)}
        </Text>
        <Button
          className="min-h-8 rounded-full px-3 text-[12px] font-[850] text-[#d9467e]"
          htmlType="button"
          size="small"
          variant="tertiary"
          onClick={() => navigation.goCreateMemory()}
        >
          Thêm kỷ niệm
        </Button>
      </Box>
    </Box>
  );
}

function getNextAnniversaryTitle(nextAnniversary: Props["nextAnniversary"]) {
  if (!nextAnniversary) return "Chưa có kỷ niệm";

  return nextAnniversary.title;
}

function getNextAnniversaryDate(nextAnniversary: Props["nextAnniversary"]) {
  if (!nextAnniversary) return "Thêm ngay";

  return formatDate(nextAnniversary.date);
}

function getDaysLeft(nextAnniversary: Props["nextAnniversary"]) {
  if (!nextAnniversary) return anniversariesCountFallback();

  return nextAnniversary.daysLeft.toLocaleString();
}

function anniversariesCountFallback() {
  return "0";
}
