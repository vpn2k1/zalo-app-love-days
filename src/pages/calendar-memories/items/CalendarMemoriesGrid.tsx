import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CellRenderInfo } from "zmp-ui/calendar";

import { AppSpinner, Box, Calendar, Text } from "@/components/zaui";

import type { TCalendarMemoriesPage } from "../CalendarMemoriesPage";
import { createCalendarMemoryLookup } from "../modules/calendarMemoryLookup";
import { useDeferredCalendarReady } from "../modules/useDeferredCalendarReady";
import { CalendarDay } from "./CalendarDay";
import { CalendarMonthYearHeader } from "./CalendarMonthYearHeader";

type Lookup = ReturnType<typeof createCalendarMemoryLookup>;

function toDateOnlyTime(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

function isSameDate(dateA?: Date, dateB?: Date): boolean {
  if (!dateA || !dateB) return false;

  return toDateOnlyTime(dateA) === toDateOnlyTime(dateB);
}

function renderCalendarCell({
  lookup,
  selectedDate,
  onSelected,
}: {
  lookup: Lookup;
  selectedDate: Date;
  onSelected: (date: Date) => void;
}) {
  return (date: Date, info: CellRenderInfo<Date>) => {
    if (info.type !== "date") {
      return <>{info.originNode}</>;
    }

    const memory = lookup.findByDate(date);
    return (
      <CalendarDay
        date={date}
        hasMemory={Boolean(memory)}
        onSelected={onSelected}
        selected={isSameDate(selectedDate, date)}
      />
    );
  };
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

export function CalendarMemoriesGrid() {
  const { setValue } = useFormContext<TCalendarMemoriesPage>();

  const anniversaries = useWatch({
    name: "anniversaries",
    exact: true,
  });

  const selectedDate = useWatch({
    name: "selectDate",
    exact: true,
  });
  const viewDate = useWatch({
    name: "viewDate",
    exact: true,
  });

  const lookup = useMemo(
    () => createCalendarMemoryLookup(anniversaries ?? []),
    [anniversaries],
  );

  const calendarReady = useDeferredCalendarReady();

  const renderDayOfWeekNameRender = (dayIndex: number) => {
    const day = dayIndex === 0 ? "CN" : `T${dayIndex + 1}`;

    return (
      <Box className="m-1 flex w-full items-center justify-center">
        <Text className="text-[13px] font-bold text-[#d9467e]">{day}</Text>
      </Box>
    );
  };

  if (!calendarReady) {
    return <CalendarLoadingFrame />;
  }

  return (
    <Box className="overflow-hidden rounded-[28px] border border-pink-100 bg-white shadow-[0_18px_40px_rgba(201,47,103,0.12)]">
      <Box className="bg-white px-3 pt-3">
        <Text className="text-center text-xs font-semibold text-[#c45a86]">
          Chạm vào ngày để xem kỷ niệm
        </Text>
      </Box>

      <Calendar
        className="overflow-hidden bg-white shadow-lg shadow-pink-200/30"
        fullscreen
        value={viewDate}
        startOfWeek={1}
        locale="vi-VN"
        dayOfWeekNameRender={renderDayOfWeekNameRender}
        onPanelChange={(date) => {
          setValue("viewDate", date);
        }}
        fullCellRender={renderCalendarCell({
          lookup,
          selectedDate,
          onSelected: (date: Date) => setValue("selectDate", date),
        })}
        headerRender={() => <CalendarMonthYearHeader />}
      />
    </Box>
  );
}
