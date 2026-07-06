import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { DatePicker } from "zmp-ui";
import type { DatePickerProps } from "zmp-ui/date-picker";

import { requiredRule } from "@/components/forms/formRules";

type Props<TFormValues extends FieldValues> = Omit<
  DatePickerProps,
  "label" | "onChange" | "value"
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
      render={({ field, fieldState }) => {
        let status = datePickerProps.status;
        if (fieldState.error) status = "error";

        return (
          <DatePicker
            {...datePickerProps}
            label={label}
            locale="vi-VN"
            columnsFormat="DD-MM-YYYY"
            dateFormat="dd/mm/yyyy"
            value={parseDateValue(field.value)}
            status={status}
            errorText={fieldState.error?.message ?? datePickerProps.errorText}
            onChange={(date) => field.onChange(formatDateValue(date))}
            onVisibilityChange={(visible) => {
              datePickerProps.onVisibilityChange?.(visible);
              if (!visible) field.onBlur();
            }}
          />
        );
      }}
    />
  );
}