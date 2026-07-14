import { type FocusEvent } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input } from "zmp-ui";
import type { TextAreaProps } from "zmp-ui/input";
import { hideKeyboard } from "zmp-sdk";

import { requiredRule } from "@/components/forms/formRules";
import { Box } from "@/components/zaui";

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
  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    if (textAreaProps.readOnly || textAreaProps.disabled) return;
    textAreaProps.onFocus?.(event);
  };

  const handleBlur = (
    event: FocusEvent<HTMLTextAreaElement>,
    onBlur: () => void,
  ) => {
    onBlur();
    textAreaProps.onBlur?.(event);
    void hideKeyboard().catch(() => undefined);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => {
        let status = textAreaProps.status;
        if (fieldState.error) status = "error";

        return (
          <Box>
            <Input.TextArea
              {...textAreaProps}
              name={field.name}
              value={(field.value ?? "") as string}
              onChange={field.onChange}
              onBlur={(event) => handleBlur(event, field.onBlur)}
              onFocus={handleFocus}
              status={status}
              errorText={fieldState.error?.message ?? textAreaProps.errorText}
            />
          </Box>
        );
      }}
    />
  );
}
