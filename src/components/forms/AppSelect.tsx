import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type Option<TValue extends string> = {
  label: string;
  value: TValue;
};

type Props<TFormValues extends FieldValues, TValue extends string> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  options: Option<TValue>[];
  required?: boolean;
};

export function AppSelect<TFormValues extends FieldValues, TValue extends string>({
  control,
  name,
  label,
  options,
  required,
}: Props<TFormValues, TValue>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required }}
      render={({ field }) => (
        <label className="native-field">
          <span>{label}</span>
          <select
            value={(field.value ?? "") as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}
    />
  );
}
