import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Picker } from "zmp-ui";
import type { OptionValueType, PickerColumnOption, PickerProps } from "zmp-ui/picker";

import { requiredRule } from "@/components/forms/formRules";

type PickerValue = Record<string, OptionValueType>;

type Props<TFormValues extends FieldValues> = Omit<
  PickerProps,
  "name" | "onChange" | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  required?: boolean | string;
};

function toPickerValue(value: unknown): PickerValue {
  return typeof value === "object" && value !== null ? value as PickerValue : {};
}

function toFormValue(value: Record<string, PickerColumnOption>): PickerValue {
  return Object.entries(value).reduce<PickerValue>((result, [key, option]) => {
    result[key] = option.value;
    return result;
  }, {});
}

export function AppPicker<TFormValues extends FieldValues>({
  control,
  name,
  required,
  ...pickerProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => (
        <Picker
          {...pickerProps}
          name={field.name}
          value={toPickerValue(field.value)}
          status={fieldState.error ? "error" : pickerProps.status}
          errorText={fieldState.error?.message ?? pickerProps.errorText}
          onChange={(value) => field.onChange(toFormValue(value))}
          onVisibilityChange={(visible) => {
            pickerProps.onVisibilityChange?.(visible);
            if (!visible) field.onBlur();
          }}
        />
      )}
    />
  );
}
