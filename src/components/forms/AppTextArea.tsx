import { type FocusEvent } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "zmp-ui";
import type { TextAreaProps } from "zmp-ui/input";
import { hideKeyboard } from "zmp-sdk";

import { requiredRule } from "@/components/forms/formRules";
import { Box } from "@/components/zaui";
import { useKeyboardFieldSpacer } from "./useKeyboardFieldSpacer";

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
  const keyboard = useKeyboardFieldSpacer();

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    keyboard.openSpacer();
    textAreaProps.onFocus?.(event);
  };

  const handleBlur = (
    event: FocusEvent<HTMLTextAreaElement>,
    onBlur: () => void,
  ) => {
    onBlur();
    textAreaProps.onBlur?.(event);
    keyboard.closeSpacer();
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
            <div ref={keyboard.fieldRef}>
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
            </div>
            <Box
              aria-hidden
              style={{
                height: keyboard.spacerHeight,
                transition: "height 160ms ease-out",
              }}
            />
          </Box>
        );
      }}
    />
  );
}
