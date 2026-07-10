import { useMemo, type RefObject } from "react";

import {
  AppSheet,
  Box,
  Button,
  Text,
  type AppSheetRef,
} from "@/components/zaui";
import { AppCalendarPickerWheel } from "@/components/forms/AppCalendarPicker/AppCalendarPickerWheel";
import type { WheelOption } from "@/components/forms/AppCalendarPicker/AppCalendarPickerWheel";

const MONTHS: WheelOption<number>[] = Array.from(
  { length: 12 },
  (_, index) => ({
    label: `Tháng ${index + 1}`,
    value: index,
  }),
);

type Props = {
  endMonth: Date;
  sheetRef: RefObject<AppSheetRef>;
  startMonth: Date;
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
};

export function AppCalendarPickerMonthYearSheet({
  endMonth,
  sheetRef,
  startMonth,
  viewDate,
  onViewDateChange,
}: Props) {
  const selectedMonth = viewDate.getMonth();
  const selectedYear = viewDate.getFullYear();
  const yearOptions = useMemo(
    () => getYearOptions(startMonth, endMonth),
    [startMonth, endMonth],
  );

  const updateDate = (year: number, monthIndex: number) => {
    const nextDate = createSafeDate(year, monthIndex, viewDate.getDate());
    onViewDateChange(clampDate(nextDate, startMonth, endMonth));
  };

  const updateMonth = (monthIndex: number) => {
    updateDate(selectedYear, monthIndex);
  };

  const updateYear = (year: number) => {
    updateDate(year, selectedMonth);
  };

  const closeSheet = () => {
    sheetRef.current?.close();
  };

  return (
    <AppSheet ref={sheetRef} autoHeight>
      <Box className="px-4 pb-6 pt-3">
        <Text.Title className="mb-2 text-center font-semibold text-[var(--love-primary)]">
          {`Tháng ${selectedMonth + 1} - ${selectedYear}`}
        </Text.Title>

        <Box className="rounded-[28px] bg-white px-3 py-4 shadow-[0_14px_32px_rgba(201,47,103,0.12)]">
          <Box className="mb-2 grid grid-cols-2 gap-3">
            <Text className="text-center text-xs font-bold uppercase tracking-wide text-[#d9467e]">
              Tháng
            </Text>

            <Text className="text-center text-xs font-bold uppercase tracking-wide text-[#d9467e]">
              Năm
            </Text>
          </Box>

          <Box className="grid grid-cols-2 gap-3">
            <AppCalendarPickerWheel
              value={selectedMonth}
              options={MONTHS}
              onChange={updateMonth}
            />

            <AppCalendarPickerWheel
              value={selectedYear}
              options={yearOptions}
              onChange={updateYear}
            />
          </Box>
        </Box>

        <Button
          fullWidth
          variant="primary"
          className="mt-4 rounded-2xl border-none font-bold"
          onClick={closeSheet}
        >
          Xong
        </Button>
      </Box>
    </AppSheet>
  );
}

function getYearOptions(startMonth: Date, endMonth: Date): WheelOption<number>[] {
  const startYear = startMonth.getFullYear();
  const endYear = endMonth.getFullYear();

  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return { label: year, value: year };
  });
}

export function createSafeDate(
  year: number,
  monthIndex: number,
  day: number,
): Date {
  const safeDay = Math.min(day, getLastDayOfMonth(year, monthIndex));

  return new Date(year, monthIndex, safeDay);
}

export function clampDate(date: Date, startDate?: Date, endDate?: Date): Date {
  if (startDate && toDateOnlyTime(date) < toDateOnlyTime(startDate)) {
    return startDate;
  }

  if (endDate && toDateOnlyTime(date) > toDateOnlyTime(endDate)) {
    return endDate;
  }

  return date;
}

function getLastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function toDateOnlyTime(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}
