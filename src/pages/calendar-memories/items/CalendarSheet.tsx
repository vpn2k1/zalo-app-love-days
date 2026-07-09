import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { AppSheet, Box, Button, Text } from "@/components/zaui";

import type { TCalendarMemoriesPage } from "../CalendarMemoriesPage";
import { refCalendar } from "../modules/useSheetCalendar";

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const WHEEL_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  label: `Tháng ${index + 1}`,
  value: index,
}));

const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: 101 }, (_, index) => {
  return CURRENT_YEAR - 50 + index;
});

function getSafeDate(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  return new Date();
}

function getLastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function createSafeDate(year: number, monthIndex: number, day: number): Date {
  const safeDay = Math.min(day, getLastDayOfMonth(year, monthIndex));

  return new Date(year, monthIndex, safeDay);
}

type WheelOption<T extends number | string> = {
  label: ReactNode;
  value: T;
};

type WheelColumnProps<T extends number | string> = {
  value: T;
  options: WheelOption<T>[];
  onChange: (value: T) => void;
};

function WheelColumn<T extends number | string>({
  value,
  options,
  onChange,
}: WheelColumnProps<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === value);

    return index >= 0 ? index : 0;
  }, [options, value]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    requestAnimationFrame(() => {
      element.scrollTo({
        top: selectedIndex * ITEM_HEIGHT,
        behavior: "auto",
      });
    });
  }, [selectedIndex]);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      const nextIndex = Math.round(element.scrollTop / ITEM_HEIGHT);
      const safeIndex = Math.max(0, Math.min(options.length - 1, nextIndex));
      const nextOption = options[safeIndex];

      element.scrollTo({
        top: safeIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });

      if (nextOption && nextOption.value !== value) {
        onChange(nextOption.value);
      }
    }, 80);
  };

  return (
    <Box className="relative overflow-hidden" style={{ height: WHEEL_HEIGHT }}>
      <Box
        className="pointer-events-none absolute left-0 right-0 z-10 rounded-2xl bg-[#ffe4ef]/80"
        style={{
          top: WHEEL_PADDING,
          height: ITEM_HEIGHT,
        }}
      />

      <Box className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white via-white/90 to-transparent" />
      <Box className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white via-white/90 to-transparent" />

      <Box
        ref={scrollRef}
        className="relative z-30 h-full overflow-y-auto snap-y snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingTop: WHEEL_PADDING,
          paddingBottom: WHEEL_PADDING,
        }}
        onScroll={handleScroll}
      >
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={String(option.value)}
              type="button"
              className={[
                "flex w-full snap-center items-center justify-center rounded-2xl text-center transition",
                isActive
                  ? "text-[17px] font-extrabold text-[#d9467e]"
                  : "text-[15px] font-semibold text-[#8b6b7d]",
              ].join(" ")}
              style={{ height: ITEM_HEIGHT }}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </Box>
    </Box>
  );
}

export function CalendarSheet() {
  const { setValue } = useFormContext<TCalendarMemoriesPage>();

  const selectedDateValue = useWatch<TCalendarMemoriesPage>({
    name: "viewDate",
    exact: true,
  });

  const selectedDate = useMemo(
    () => getSafeDate(selectedDateValue),
    [selectedDateValue],
  );

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const monthOptions = useMemo(
    () =>
      MONTHS.map((month) => ({
        label: month.label,
        value: month.value,
      })),
    [],
  );

  const yearOptions = useMemo(
    () =>
      YEARS.map((year) => ({
        label: year,
        value: year,
      })),
    [],
  );

  const updateDate = (year: number, monthIndex: number) => {
    const nextDate = createSafeDate(year, monthIndex, selectedDate.getDate());

    setValue("viewDate", nextDate, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const updateMonth = (monthIndex: number) => {
    updateDate(selectedYear, monthIndex);
  };

  const updateYear = (year: number) => {
    updateDate(year, selectedMonth);
  };

  const closeSheet = () => {
    (
      refCalendar.current as {
        close?: () => void;
      } | null
    )?.close?.();
  };

  return (
    <AppSheet ref={refCalendar} autoHeight>
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
            <WheelColumn
              value={selectedMonth}
              options={monthOptions}
              onChange={updateMonth}
            />

            <WheelColumn
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
