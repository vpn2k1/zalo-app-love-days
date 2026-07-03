import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "zmp-ui";
import type { TextAreaProps } from "zmp-ui/input";

type Props<TFormValues extends FieldValues> = Omit<
  TextAreaProps,
  "name" | "value" | "onChange"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
};

export function AppTextArea<TFormValues extends FieldValues>({
  control,
  name,
  ...textAreaProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input.TextArea
          {...textAreaProps}
          value={(field.value ?? "") as string}
          onChange={field.onChange}
        />
      )}
    />
  );
}
