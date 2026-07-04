import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Switch } from "zmp-ui";
import type { SwitchProps } from "zmp-ui/switch";

type Props<TFormValues extends FieldValues> = Omit<
  SwitchProps,
  "checked" | "name" | "onChange" | "type"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
};

export function AppSwitch<TFormValues extends FieldValues>({
  control,
  name,
  ...switchProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Switch
          {...switchProps}
          name={field.name}
          checked={Boolean(field.value)}
          onChange={(event) => field.onChange(event.target.checked)}
        />
      )}
    />
  );
}
