import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { requiredRule } from "@/components/forms/formRules";

export type ImageMultiPickerFieldProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  maxCount: number;
  name: Path<TFormValues>;
  required?: boolean | string;
};

export function useAppImageMultiPickerField<TFormValues extends FieldValues>({
  control,
  maxCount,
  name,
  required,
}: ImageMultiPickerFieldProps<TFormValues>) {
  const { field, fieldState } = useController({
    control,
    name,
    rules: {
      required: requiredRule(required),
      validate: (value) => validateImages(value, required),
    },
  });

  return {
    error: fieldState.error?.message,
    field: {
      onBlur: field.onBlur,
      onChange: field.onChange,
      value: normalizeImages(field.value).slice(0, maxCount),
    },
  };
}

function validateImages(value: unknown, required?: boolean | string) {
  if (!required) return true;
  if (normalizeImages(value).length > 0) return true;
  if (typeof required === "string") return required;

  return "Vui lòng chọn ít nhất một ảnh.";
}

function normalizeImages(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}
