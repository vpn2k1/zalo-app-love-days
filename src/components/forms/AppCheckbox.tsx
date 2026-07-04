import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Checkbox } from "zmp-ui";
import type { CheckboxProps } from "zmp-ui/checkbox";

type Props<TFormValues extends FieldValues> = Omit<
  CheckboxProps,
  "checked" | "name" | "onChange" | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  value?: CheckboxProps["value"];
};

export function AppCheckbox<TFormValues extends FieldValues>({
  control,
  name,
  value = "checked",
  ...checkboxProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Checkbox
          {...checkboxProps}
          name={field.name}
          value={value}
          checked={Boolean(field.value)}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            field.onChange(event.target.checked);
          }}
        />
      )}
    />
  );
}
