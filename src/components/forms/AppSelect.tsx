import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Select } from "zmp-ui";
import type { SelectProps } from "zmp-ui/select";

import { requiredRule } from "@/components/forms/formRules";

type Option<TValue extends string> = {
  label: string;
  value: TValue;
  disabled?: boolean;
};

type Props<TFormValues extends FieldValues, TValue extends string> = Omit<
  SelectProps,
  "children" | "label" | "name" | "onChange" | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  options: Option<TValue>[];
  required?: boolean | string;
};

export function AppSelect<TFormValues extends FieldValues, TValue extends string>({
  control,
  name,
  label,
  options,
  required,
  ...selectProps
}: Props<TFormValues, TValue>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => {
        let status = selectProps.status;
        if (fieldState.error) status = "error";

        return (
          <Select
            {...selectProps}
            className={mergeClassNames("app-select", selectProps.className)}
            closeOnSelect={getCloseOnSelect(
              selectProps.closeOnSelect,
              selectProps.multiple,
            )}
            label={label}
            name={field.name}
            value={(field.value ?? "") as string}
            status={status}
            errorText={fieldState.error?.message ?? selectProps.errorText}
            onChange={field.onChange}
            onVisibilityChange={(visible) => {
              selectProps.onVisibilityChange?.(visible);
              if (!visible) field.onBlur();
            }}
          >
            {options.map((option) => (
              <Select.Option
                key={option.value}
                value={option.value}
                title={option.label}
                disabled={option.disabled}
              />
            ))}
          </Select>
        );
      }}
    />
  );
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function getCloseOnSelect(
  closeOnSelect: SelectProps["closeOnSelect"],
  multiple: SelectProps["multiple"],
) {
  if (closeOnSelect !== undefined) return closeOnSelect;
  if (multiple) return false;

  return true;
}
