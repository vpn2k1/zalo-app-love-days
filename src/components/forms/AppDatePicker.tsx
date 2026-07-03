import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  required?: boolean;
};

export function AppDatePicker<TFormValues extends FieldValues>({
  control,
  name,
  label,
  required,
}: Props<TFormValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ field }) => (
        <label className="native-field">
          <span>{label}</span>
          <input
            type="date"
            value={(field.value ?? "") as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        </label>
      )}
    />
  );
}
