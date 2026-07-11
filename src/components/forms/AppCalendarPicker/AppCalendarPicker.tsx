import { useCallback, useMemo, type PointerEvent, type SyntheticEvent } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { DatePickerProps } from "zmp-ui/date-picker";

import { AppCalendarPickerCalendar } from "@/components/forms/AppCalendarPicker/AppCalendarPickerCalendar";
import {
  formatDateValue,
  getMonthBoundary,
  isDateDisabled,
  parseDateValue,
  useModalVisible,
} from "@/components/forms/AppCalendarPicker/AppCalendarPickerUtils";
import { requiredRule } from "@/components/forms/formRules";
import { AppModal, Box, Icon } from "@/components/zaui";
import { AppTextInput } from "../AppTextInput";

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

export function AppCalendarPicker<TFormValues extends FieldValues>({
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
          control={control}
          fieldValue={field.value}
          name={field.name}
          label={label}
          onBlur={field.onBlur}
          onChange={field.onChange}
        />
      )}
    />
  );
}

type AppDatePickerFieldProps<TFormValues extends FieldValues> = Omit<
  Props<TFormValues>,
  "required"
> & {
  fieldValue: unknown;
  onBlur: () => void;
  onChange: (value: string) => void;
};

function AppDatePickerField<TFormValues extends FieldValues>({
  fieldValue,
  name,
  label,
  onBlur,
  onChange,
  title = "Chọn ngày",
  defaultOpen = false,
  defaultValue,
  disabled,
  startDate,
  endDate,
  inputClass,
  mask = true,
  maskClosable = true,
  onVisibilityChange,
  placeholder,
  prefix,
  suffix,
  control,
}: AppDatePickerFieldProps<TFormValues>) {
  const selectedDate = useMemo(
    () => parseDateValue(fieldValue) ?? defaultValue,
    [fieldValue, defaultValue],
  );

  const startMonth = useMemo(
    () => getMonthBoundary(startDate, new Date(1900, 0)),
    [startDate],
  );
  const endMonth = useMemo(
    () => getMonthBoundary(endDate, new Date(2100, 11)),
    [endDate],
  );
  const [visible, changeVisible] = useModalVisible(
    defaultOpen,
    onVisibilityChange,
  );

  const openCalendar = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;

      requestAnimationFrame(() => changeVisible(true));
    },
    [disabled, changeVisible],
  );

  const closeCalendar = useCallback(() => {
    changeVisible(false);
    onBlur();
  }, [changeVisible, onBlur]);
  const stopPickerEvent = useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);

  const selectDate = useCallback(
    (date: Date) => {
      if (isDateDisabled(date, startDate, endDate)) return;

      onChange(formatDateValue(date));
      closeCalendar();
    },
    [onChange, closeCalendar, startDate, endDate],
  );

  return (
    <Box onClick={stopPickerEvent} onTouchStart={stopPickerEvent}>
      <Box onClick={stopPickerEvent} onPointerDown={openCalendar}>
        <AppTextInput
          control={control}
          disabled={disabled}
          name={name}
          label={label}
          className={inputClass}
          placeholder={placeholder ?? "Chọn ngày"}
          suffix={suffix ?? <Icon icon="zi-calendar" className="mr-3" />}
          prefix={prefix}
          readOnly
        />
      </Box>

      <AppModal
        title={title}
        mask={mask}
        maskClosable={maskClosable}
        visible={visible}
        onClose={closeCalendar}
      >
        <Box
          className="app-day-picker"
          onClick={stopPickerEvent}
          onPointerDown={(event) => event.stopPropagation()}
          onTouchStart={stopPickerEvent}
        >
          <AppCalendarPickerCalendar
            selectedDate={selectedDate}
            startDate={startDate}
            endDate={endDate}
            startMonth={startMonth}
            endMonth={endMonth}
            onSelect={selectDate}
          />
        </Box>
      </AppModal>
    </Box>
  );
}
