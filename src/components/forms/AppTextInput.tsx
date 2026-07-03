import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "zmp-ui";
import type { InputProps } from "zmp-ui/input";

type Props<TFormValues extends FieldValues> = Omit<
  InputProps,
  "name" | "value" | "onChange"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
};

export function AppTextInput<TFormValues extends FieldValues>({
  control,
  name,
  ...inputProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input
          {...inputProps}
          value={(field.value ?? "") as string}
          onChange={field.onChange}
        />
      )}
    />
  );
}
