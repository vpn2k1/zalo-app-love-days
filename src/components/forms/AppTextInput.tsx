import { type FocusEvent } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input } from "zmp-ui";
import type { InputProps } from "zmp-ui/input";
import { hideKeyboard } from "zmp-sdk";

import { requiredRule } from "@/components/forms/formRules";
import { Box } from "@/components/zaui";

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
  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (inputProps.disabled || inputProps.readOnly) return;
    inputProps.onFocus?.(event);
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement>,
    onBlur: () => void,
  ) => {
    onBlur();
    inputProps.onBlur?.(event);
    void hideKeyboard().catch(() => undefined);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => {
        let status = inputProps.status;
        if (fieldState.error) status = "error";

        return (
          <Box>
            <Input
              {...inputProps}
              name={field.name}
              value={(field.value ?? "") as string}
              onChange={field.onChange}
              onBlur={(event) => handleBlur(event, field.onBlur)}
              onFocus={handleFocus}
              status={status}
              errorText={fieldState.error?.message ?? inputProps.errorText}
            />
          </Box>
        );
      }}
    />
  );
}
