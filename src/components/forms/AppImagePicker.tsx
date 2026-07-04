import { useState } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { AppImageViewer, Button, Icon, Text } from "@/components/zaui";
import { requiredRule } from "@/components/forms/formRules";
import { pickImagePath } from "@/utils/imagePicker";

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  optional?: boolean;
  required?: boolean | string;
};

export function AppImagePicker<TFormValues extends FieldValues>({
  control,
  name,
  label,
  optional,
  required,
}: Props<TFormValues>) {
  const [error, setError] = useState("");
  const [viewerVisible, setViewerVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => {
        const value = String(field.value ?? "");
        const errorText = error || fieldState.error?.message;
        let labelText = label;
        if (optional) {
          labelText = `${label} (không bắt buộc)`;
        }
        let pickButtonLabel = "Chọn hoặc chụp ảnh";
        if (value) {
          pickButtonLabel = "Chọn ảnh khác";
        }

        const pickImage = async () => {
          setError("");
          try {
            const image = await pickImagePath();
            if (image) {
              field.onChange(image);
              field.onBlur();
            }
          } catch (pickerError) {
            console.error(pickerError);
            setError("Không thể chọn ảnh. Vui lòng thử lại.");
          }
        };

        return (
          <div className="app-image-picker">
            <Text className="form-label">{labelText}</Text>
            {value && (
              <>
                <Button
                  className="app-image-picker-preview"
                  htmlType="button"
                  variant="tertiary"
                  prefixIcon={<Icon icon="zi-add-photo" />}
                  onClick={() => setViewerVisible(true)}
                >
                  Xem ảnh đã chọn
                </Button>
                <AppImageViewer
                  images={[{ src: value, alt: label }]}
                  visible={viewerVisible}
                  onClose={() => setViewerVisible(false)}
                />
              </>
            )}
            <div className="app-image-picker-actions">
              <Button
                htmlType="button"
                variant="secondary"
                prefixIcon={<Icon icon="zi-camera" />}
                onClick={pickImage}
              >
                {pickButtonLabel}
              </Button>
              {value && (
                <Button
                  htmlType="button"
                  variant="tertiary"
                  onClick={() => {
                    field.onChange("");
                    field.onBlur();
                  }}
                >
                  Xóa ảnh
                </Button>
              )}
            </div>
            {errorText && <Text className="app-error-text">{errorText}</Text>}
          </div>
        );
      }}
    />
  );
}
