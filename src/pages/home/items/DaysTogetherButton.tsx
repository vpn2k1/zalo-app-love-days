import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { Box, Text } from "@/components/zaui";

import { useDaysTogether } from "../modules/useDaysTogether";
import { DaysTogetherSheet } from "./DaysTogetherSheet";

export function DaysTogetherButton() {
  const daysTogether = useDaysTogether();
  if (!daysTogether.startDate) return null;

  return (
    <Box
      onClick={daysTogether.openSheet}
      className="relative mb-3.5 w-full overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-[#fff7fb] via-white to-[#ffe4ef] px-5 py-6 text-center shadow-[0_18px_40px_rgba(217,70,126,0.18)]"
    >
      <Box className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[#ffd1e3] opacity-60 blur-2xl" />
      <Box className="pointer-events-none absolute -bottom-10 -right-8 h-28 w-28 rounded-full bg-[#f9a8d4] opacity-40 blur-2xl" />

      <Box className="relative z-10">
        <Text className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#c45a86]">
          Chúng mình đã bên nhau
        </Text>

        <Box className="mt-3 flex min-w-0 flex-wrap items-end justify-center gap-2">
          <Text className="min-w-0 font-serif text-[clamp(40px,15vw,56px)] font-bold leading-none text-[#d9467e] drop-shadow-sm">
            {daysTogether.elapsed.days.toLocaleString()}
          </Text>
          <Text className="mb-1 text-[18px] font-semibold text-[#9b6b82]">
            ngày
          </Text>
        </Box>

        <Box className="mt-5 grid grid-cols-3 gap-1.5">
          <TimeBox value={daysTogether.elapsed.hours} label="Giờ" />
          <TimeBox value={daysTogether.elapsed.minutes} label="Phút" />
          <TimeBox value={daysTogether.elapsed.seconds} label="Giây" />
        </Box>

        <Text className="mt-4 text-[13px] font-medium text-[#a18495]">
          Từ ngày {formatDate(daysTogether.startDate)}
        </Text>
      </Box>
      <DaysTogetherSheet
        control={daysTogether.control}
        elapsed={daysTogether.elapsed}
        loading={daysTogether.loading}
        disabled={daysTogether.disabled}
        sheetRef={daysTogether.sheetRef}
        onClose={daysTogether.closeSheet}
        onSave={daysTogether.save}
      />
      <BlockingLoadingOverlay
        show={daysTogether.loading}
        message="Đang lưu thông tin không gian..."
      />
    </Box>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <Box className="min-w-0 rounded-2xl border border-white bg-white/75 px-1.5 py-3 shadow-sm">
      <Text className="text-[clamp(18px,6vw,22px)] font-bold leading-none text-[#d9467e]">
        {String(value).padStart(2, "0")}
      </Text>
      <Text className="mt-1 text-[12px] font-medium text-[#9b6b82]">
        {label}
      </Text>
    </Box>
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
