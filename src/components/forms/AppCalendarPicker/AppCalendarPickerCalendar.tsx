import { useCallback, useEffect, useRef, useState } from "react";

import { Box, Calendar, type AppSheetRef } from "@/components/zaui";
import {
  renderDateCell,
  renderDayOfWeekName,
} from "@/components/forms/AppCalendarPicker/AppCalendarPickerDay";
import { AppCalendarPickerHeader } from "@/components/forms/AppCalendarPicker/AppCalendarPickerHeader";
import {
  AppCalendarPickerMonthYearSheet,
  clampDate,
} from "@/components/forms/AppCalendarPicker/AppCalendarPickerMonthYearSheet";
import { isDateDisabled } from "@/components/forms/AppCalendarPicker/AppCalendarPickerUtils";

type Props = {
  endDate?: Date;
  endMonth: Date;
  selectedDate?: Date;
  startDate?: Date;
  startMonth: Date;
  onSelect: (date: Date) => void;
};

export function AppCalendarPickerCalendar({
  endDate,
  endMonth,
  selectedDate,
  startDate,
  startMonth,
  onSelect,
}: Props) {
  const sheetRef = useRef<AppSheetRef>(null);
  const [viewDate, setViewDate] = useState(() => getSafeDate(selectedDate));

  useEffect(() => {
    setViewDate(clampDate(getSafeDate(selectedDate), startDate, endDate));
  }, [selectedDate, startDate, endDate]);

  const disabledDate = useCallback(
    (date: Date) => isDateDisabled(date, startDate, endDate),
    [startDate, endDate],
  );

  const changeViewDate = useCallback(
    (date: Date) => {
      setViewDate(clampDate(date, startDate, endDate));
    },
    [startDate, endDate],
  );

  const openMonthYearSheet = () => {
    sheetRef.current?.open();
  };

  return (
    <Box>
      <Calendar
        value={viewDate}
        startOfWeek={1}
        locale="vi-VN"
        dayOfWeekNameRender={renderDayOfWeekName}
        disabledDate={disabledDate}
        fullCellRender={renderDateCell({
          disabledDate,
          selectedDate,
          onSelected: onSelect,
        })}
        headerRender={() => (
          <AppCalendarPickerHeader
            viewDate={viewDate}
            startDate={startDate}
            endDate={endDate}
            onOpenSheet={openMonthYearSheet}
            onViewDateChange={changeViewDate}
          />
        )}
      />

      <AppCalendarPickerMonthYearSheet
        sheetRef={sheetRef}
        viewDate={viewDate}
        startMonth={startMonth}
        endMonth={endMonth}
        onViewDateChange={changeViewDate}
      />
    </Box>
  );
}

function getSafeDate(value: Date | undefined): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  return new Date();
}
