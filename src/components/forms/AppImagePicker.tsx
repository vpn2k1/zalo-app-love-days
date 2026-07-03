import { useState } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Button, Icon, Text } from "zmp-ui";
import { pickImagePath } from "@/utils/imagePicker";

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  optional?: boolean;
};

export function AppImagePicker<TFormValues extends FieldValues>({
  control,
  name,
  label,
  optional,
}: Props<TFormValues>) {
  const [error, setError] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = String(field.value ?? "");

        const pickImage = async () => {
          setError("");
          try {
            const image = await pickImagePath();
            if (image) field.onChange(image);
          } catch (pickerError) {
            console.error(pickerError);
            setError("Không thể chọn ảnh. Vui lòng thử lại.");
          }
        };

        return (
          <div className="app-image-picker">
            <Text className="form-label">
              {label}{optional ? " (không bắt buộc)" : ""}
            </Text>
            {value && (
              <img className="app-image-picker-preview" src={value} alt="" />
            )}
            <div className="app-image-picker-actions">
              <Button
                htmlType="button"
                variant="secondary"
                prefixIcon={<Icon icon="zi-camera" />}
                onClick={pickImage}
              >
                {value ? "Chọn ảnh khác" : "Chọn hoặc chụp ảnh"}
              </Button>
              {value && (
                <Button
                  htmlType="button"
                  variant="tertiary"
                  onClick={() => field.onChange("")}
                >
                  Xóa ảnh
                </Button>
              )}
            </div>
            {error && <Text className="app-error-text">{error}</Text>}
          </div>
        );
      }}
    />
  );
}
