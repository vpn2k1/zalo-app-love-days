import { useCallback, useState } from "react";
import type { DatePickerProps } from "zmp-ui/date-picker";

import type { CalendarDateValue } from "@/types/date";

export function useModalVisible(
  defaultOpen: boolean,
  onVisibilityChange?: (visible: boolean) => void,
) {
  const [visible, setVisible] = useState(defaultOpen);
  const changeVisible = useCallback(
    (nextVisible: boolean) => {
      setVisible(nextVisible);
      onVisibilityChange?.(nextVisible);
    },
    [onVisibilityChange],
  );

  return [visible, changeVisible] as const;
}

export function parseDateValue(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value !== "string" || !value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return undefined;

  return date;
}

export function formatDateValue(date: Date): CalendarDateValue {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}` as CalendarDateValue;
}

export function formatDisplayValue(
  date: Date | undefined,
  locale: string,
): string {
  if (!date) return "";

  return date.toLocaleDateString(locale);
}

export function getMonthBoundary(
  date: Date | undefined,
  fallback: Date,
): Date {
  return new Date(
    date?.getFullYear() ?? fallback.getFullYear(),
    date?.getMonth() ?? fallback.getMonth(),
  );
}

export function getStatusValue(
  fieldError?: string,
  status?: DatePickerProps["status"],
) {
  if (fieldError) return "error";

  return status;
}

export function isDateDisabled(
  date: Date,
  startDate?: Date,
  endDate?: Date,
): boolean {
  const currentTime = toDateOnlyTime(date);

  if (startDate && currentTime < toDateOnlyTime(startDate)) return true;
  if (endDate && currentTime > toDateOnlyTime(endDate)) return true;

  return false;
}

export function toDateOnlyTime(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}
