import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { vi } from "@daypicker/react/locale";

import { useCallback, useMemo, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Box } from "zmp-ui";
import type { DatePickerProps } from "zmp-ui/date-picker";

import { requiredRule } from "@/components/forms/formRules";
import { AppDatePickerTrigger } from "@/components/forms/AppDatePickerTrigger";
import { AppModal } from "@/components/zaui";

type Props<TFormValues extends FieldValues> = Omit<
  DatePickerProps,
  | "action"
  | "columnsFormat"
  | "dateFormat"
  | "formatPickedValueDisplay"
  | "onChange"
  | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean | string;
};

function parseDateValue(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value !== "string" || !value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayValue(date: Date | undefined, locale: string): string {
  return date ? date.toLocaleDateString(locale) : "";
}

function toDateOnlyTime(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

function isDateDisabled(date: Date, startDate?: Date, endDate?: Date): boolean {
  const currentTime = toDateOnlyTime(date);

  if (startDate && currentTime < toDateOnlyTime(startDate)) {
    return true;
  }

  if (endDate && currentTime > toDateOnlyTime(endDate)) {
    return true;
  }

  return false;
}

function getMonthBoundary(date: Date | undefined, fallback: Date): Date {
  return new Date(
    date?.getFullYear() ?? fallback.getFullYear(),
    date?.getMonth() ?? fallback.getMonth(),
  );
}

export function AppDatePicker2<TFormValues extends FieldValues>({
  control,
  name,
  label,
  required,
  ...datePickerProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => (
        <AppDatePickerField
          {...datePickerProps}
          fieldValue={field.value}
          fieldError={fieldState.error?.message}
          name={field.name}
          label={label}
          onBlur={field.onBlur}
          onChange={field.onChange}
        />
      )}
    />
  );
}

type AppDatePickerFieldProps = Omit<
  Props<FieldValues>,
  "control" | "name" | "required"
> & {
  fieldValue: unknown;
  name: string;
  fieldError?: string;
  onBlur: () => void;
  onChange: (value: string) => void;
};

function AppDatePickerField({
  fieldValue,
  name,
  label,
  fieldError,
  onBlur,
  onChange,
  title = "Chọn ngày",
  defaultOpen = false,
  defaultValue,
  disabled,
  startDate,
  endDate,
  errorText,
  helperText,
  inputClass,
  locale = "vi-VN",
  mask = true,
  maskClosable = true,
  onVisibilityChange,
  placeholder,
  prefix,
  status,
  suffix,
}: AppDatePickerFieldProps) {
  const [visible, setVisible] = useState(defaultOpen);

  const selectedDate = useMemo(
    () => parseDateValue(fieldValue) ?? defaultValue,
    [fieldValue, defaultValue],
  );

  const displayValue = useMemo(
    () => formatDisplayValue(selectedDate, locale),
    [selectedDate, locale],
  );

  const statusValue = fieldError ? "error" : status;
  const errorValue = fieldError ?? errorText;

  const startMonth = useMemo(
    () => getMonthBoundary(startDate, new Date(1900, 0)),
    [startDate],
  );

  const endMonth = useMemo(
    () => getMonthBoundary(endDate, new Date(2100, 11)),
    [endDate],
  );

  const changeVisible = useCallback(
    (nextVisible: boolean) => {
      setVisible(nextVisible);
      onVisibilityChange?.(nextVisible);
    },
    [onVisibilityChange],
  );

  const openCalendar = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!disabled) {
        changeVisible(true);
      }
    },
    [disabled, changeVisible],
  );

  const closeCalendar = useCallback(() => {
    changeVisible(false);
    onBlur();
  }, [changeVisible, onBlur]);

  const disabledDate = useCallback(
    (date: Date) => isDateDisabled(date, startDate, endDate),
    [startDate, endDate],
  );

  const selectDate = useCallback(
    (date?: Date) => {
      if (!date || disabledDate(date)) {
        return;
      }

      onChange(formatDateValue(date));
      closeCalendar();
    },
    [onChange, closeCalendar, disabledDate],
  );

  return (
    <Box>
      <AppDatePickerTrigger
        disabled={disabled}
        displayValue={displayValue}
        errorText={errorValue}
        hasError={Boolean(fieldError)}
        helperText={helperText}
        inputClass={inputClass}
        label={label}
        name={name}
        placeholder={placeholder}
        prefix={prefix}
        status={statusValue}
        suffix={suffix}
        onOpen={openCalendar}
      />

      <AppModal
        title={title}
        mask={mask}
        maskClosable={maskClosable}
        visible={visible}
        onClose={closeCalendar}
      >
        <Box
          className="app-day-picker"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DayPicker
            mode="single"
            weekStartsOn={1}
            selected={selectedDate}
            defaultMonth={selectedDate ?? defaultValue ?? new Date()}
            captionLayout="dropdown"
            navLayout="after"
            locale={vi}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={disabledDate}
            onSelect={selectDate}
          />
        </Box>
      </AppModal>
    </Box>
  );
}
