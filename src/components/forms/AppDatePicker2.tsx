import { useRef, useState } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Box, Calendar } from "zmp-ui";
import type { DatePickerProps } from "zmp-ui/date-picker";
import { requiredRule } from "@/components/forms/formRules";
import { AppDatePickerTrigger } from "@/components/forms/AppDatePickerTrigger";
import { AppModal } from "@/components/zaui";

type Props<TFormValues extends FieldValues> = Omit<
  DatePickerProps,
  "action" | "columnsFormat" | "dateFormat" | "formatPickedValueDisplay" | "onChange" | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean | string;
};

function parseDateValue(value: unknown): Date | undefined {
  if (value instanceof Date) return value;
  if (typeof value !== "string" || !value) return undefined;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayValue(date: Date | undefined, locale: string): string {
  if (!date) return "";

  return date.toLocaleDateString(locale);
}

function getStatus(
  fieldError: boolean,
  status: DatePickerProps["status"],
): DatePickerProps["status"] {
  if (fieldError) return "error";

  return status;
}

function getErrorText(fieldError: string | undefined, errorText: string | undefined) {
  if (fieldError) return fieldError;

  return errorText;
}

function isDateDisabled(date: Date, startDate: Date | undefined, endDate: Date | undefined) {
  if (startDate && date < startDate) return true;
  if (endDate && date > endDate) return true;

  return false;
}

export function AppDatePicker<TFormValues extends FieldValues>({
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
          fieldValue={field.value}
          name={field.name}
          label={label}
          fieldError={fieldState.error?.message}
          onBlur={field.onBlur}
          onChange={field.onChange}
          {...datePickerProps}
        />
      )}
    />
  );
}

type AppDatePickerFieldProps = Omit<Props<FieldValues>, "control" | "name" | "required"> & {
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
  startDate,
  status,
  suffix,
}: AppDatePickerFieldProps) {
  const [visible, setVisible] = useState(defaultOpen);
  const calendarInteractedRef = useRef(false);
  const value = parseDateValue(fieldValue) ?? defaultValue;
  const displayValue = formatDisplayValue(value, locale);
  const statusValue = getStatus(Boolean(fieldError), status);
  const errorValue = getErrorText(fieldError, errorText);

  const changeVisible = (nextVisible: boolean) => {
    setVisible(nextVisible);
    onVisibilityChange?.(nextVisible);
  };

  const openCalendar = (event: React.PointerEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    calendarInteractedRef.current = false;
    changeVisible(true);
  };

  const closeCalendar = () => {
    changeVisible(false);
    onBlur();
  };

  const markCalendarInteraction = (event: React.PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    calendarInteractedRef.current = true;
  };

  const selectDate = (date: Date) => {
    if (!calendarInteractedRef.current) return;
    onChange(formatDateValue(date));
    closeCalendar();
  };

  return (
    <>
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
        <Box onPointerDown={markCalendarInteraction}>
          <Calendar
            autoHeight
            value={value}
            defaultValue={defaultValue}
            locale={locale}
            startOfWeek={1}
            disabledDate={(date) => isDateDisabled(date, startDate, endDate)}
            onSelect={selectDate}
          />
        </Box>
      </AppModal>
    </>
  );
}
