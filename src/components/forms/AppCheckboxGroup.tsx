import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Checkbox } from "zmp-ui";
import type { CheckboxGroupProps, CheckboxProps } from "zmp-ui/checkbox";

import { Text } from "@/components/zaui";
import { requiredRule } from "@/components/forms/formRules";

type Option = Pick<CheckboxProps, "disabled" | "label" | "value">;

type Props<TFormValues extends FieldValues> = Omit<
  CheckboxGroupProps,
  "name" | "onChange" | "options" | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  options: Option[];
  required?: boolean | string;
};

export function AppCheckboxGroup<TFormValues extends FieldValues>({
  control,
  name,
  label,
  options,
  required,
  ...groupProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => {
        let value: string[] = [];
        if (Array.isArray(field.value)) {
          value = field.value;
        }

        return (
          <div>
            {label && <Text className="form-label">{label}</Text>}
          <Checkbox.Group
            {...groupProps}
            name={field.name}
            value={value}
            options={options as CheckboxProps[]}
            onChange={field.onChange}
          />
          {fieldState.error && (
            <Text className="app-error-text">{fieldState.error.message}</Text>
          )}
          </div>
        );
      }}
    />
  );
}
