import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "zmp-ui";
import type { InputProps } from "zmp-ui/input";

import { requiredRule } from "@/components/forms/formRules";

type Props<TFormValues extends FieldValues> = Omit<
  InputProps,
  "name" | "value" | "onChange"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  required?: boolean | string;
};

export function AppTextInput<TFormValues extends FieldValues>({
  control,
  name,
  required,
  ...inputProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => (
        <Input
          {...inputProps}
          name={field.name}
          value={(field.value ?? "") as string}
          onChange={field.onChange}
          onBlur={field.onBlur}
          status={fieldState.error ? "error" : inputProps.status}
          errorText={fieldState.error?.message ?? inputProps.errorText}
        />
      )}
    />
  );
}
