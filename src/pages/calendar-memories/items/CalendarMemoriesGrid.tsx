import { useMemo } from "react";
import type { CellRenderInfo } from "zmp-ui/calendar";
import { AppSpinner, Box, Calendar, Icon, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import { createCalendarMemoryLookup } from "../modules/calendarMemoryLookup";
import { useDeferredCalendarReady } from "../modules/useDeferredCalendarReady";

type Props = {
  anniversaries: Anniversary[];
  onOpenMemory: (memoryId: string) => void;
};

type Lookup = ReturnType<typeof createCalendarMemoryLookup>;

function renderCalendarCell(lookup: Lookup) {
  return (date: Date, info: CellRenderInfo<Date>) => {
    if (info.type !== "date") {
      return <>{info.originNode}</>;
    }

    const memory = lookup.findByDate(date);
    const dayLabel = date.getDate().toString();
    return <CalendarDay hasMemory={Boolean(memory)} label={dayLabel} />;
  };
}

export function CalendarMemoriesGrid({ anniversaries, onOpenMemory }: Props) {
  const lookup = useMemo(
    () => createCalendarMemoryLookup(anniversaries),
    [anniversaries],
  );
  const calendarReady = useDeferredCalendarReady();

  const openDateMemory = (date: Date) => {
    console.log(date.getUTCDate());

    const memory = lookup.findByDate(date);
    if (!memory) return;

    onOpenMemory(memory.id);
  };

  const renderDayOfWeekNameRender = (d: number) => {
    let day = `T${d + 1}`;
    if (!d) day = "CN";
    return (
      <Text size="small" className="text-[var(--love-primary)]">
        {day}
      </Text>
    );
  };

  if (!calendarReady) return <CalendarLoadingFrame />;

  return (
    <Calendar
      fullscreen
      startOfWeek={1}
      dayOfWeekNameRender={renderDayOfWeekNameRender}
      locale="vi-VN"
      fullCellRender={renderCalendarCell(lookup)}
      onSelect={openDateMemory}
    />
  );
}

function CalendarLoadingFrame() {
  return (
    <Box className="grid min-h-[420px] place-items-center rounded-[24px] bg-white/90 p-4 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Box className="grid place-items-center gap-3 text-center">
        <AppSpinner />
        <Text className="text-sm font-bold text-[#8b6b7d]">
          Đang mở lịch kỷ niệm...
        </Text>
      </Box>
    </Box>
  );
}

function CalendarDay({
  hasMemory,
  label,
}: {
  hasMemory?: boolean;
  label: string;
}) {
  if (!hasMemory) {
    return (
      <Box className="grid min-h-[70px] place-items-center">
        <Box className="bg-[var(--love-next-tint)] min-h-[60px] w-[35px] p-2 rounded-full place-items-center">
          <Text className="text-sm font-bold text-center">{label}</Text>
          <Icon icon="zi-heart-solid" size={14} className=" text-white" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="grid min-h-[70px] place-items-center">
      <Box className="bg-[var(--love-primary)] min-h-[60px] w-[35px] p-2 rounded-full place-items-center">
        <Text className="text-sm font-[900] text-white text-center">
          {label}
        </Text>
        <Icon icon="zi-heart-solid" size={14} className=" text-white" />
      </Box>
    </Box>
  );
}
