import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Radio } from "zmp-ui";
import type { RadioGroupProps, RadioProps } from "zmp-ui/radio";

import { Box, Text } from "@/components/zaui";
import { requiredRule } from "@/components/forms/formRules";

type Option = Pick<RadioProps, "disabled" | "label" | "value">;

type Props<TFormValues extends FieldValues> = Omit<
  RadioGroupProps,
  "name" | "onChange" | "options" | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  options: Option[];
  required?: boolean | string;
};

export function AppRadioGroup<TFormValues extends FieldValues>({
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
      render={({ field, fieldState }) => (
        <Box>
          {label && <Text className="form-label">{label}</Text>}
          <Radio.Group
            {...groupProps}
            name={field.name}
            value={field.value}
            options={options}
            onChange={field.onChange}
          />
          {fieldState.error && (
            <Text className="app-error-text">{fieldState.error.message}</Text>
          )}
        </Box>
      )}
    />
  );
}
