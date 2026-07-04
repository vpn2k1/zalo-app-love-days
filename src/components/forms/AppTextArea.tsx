import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "zmp-ui";
import type { TextAreaProps } from "zmp-ui/input";

import { requiredRule } from "@/components/forms/formRules";

type Props<TFormValues extends FieldValues> = Omit<
  TextAreaProps,
  "name" | "value" | "onChange"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  required?: boolean | string;
};

export function AppTextArea<TFormValues extends FieldValues>({
  control,
  name,
  required,
  ...textAreaProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => (
        <Input.TextArea
          {...textAreaProps}
          name={field.name}
          value={(field.value ?? "") as string}
          onChange={field.onChange}
          onBlur={field.onBlur}
          status={fieldState.error ? "error" : textAreaProps.status}
          errorText={fieldState.error?.message ?? textAreaProps.errorText}
        />
      )}
    />
  );
}
