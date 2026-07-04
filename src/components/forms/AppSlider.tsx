import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Slider } from "zmp-ui";
import type { SliderProps } from "zmp-ui/slider";

type Props<TFormValues extends FieldValues> = Omit<
  SliderProps,
  "name" | "onChange" | "value"
> & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
};

export function AppSlider<TFormValues extends FieldValues>({
  control,
  name,
  ...sliderProps
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Slider
          {...sliderProps}
          value={Number(field.value ?? sliderProps.min ?? 0)}
          onChange={field.onChange}
        />
      )}
    />
  );
}
