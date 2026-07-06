import { useState } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type ControllerFieldState,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { AppActionSheet, Box, Button, Icon, Text } from "@/components/zaui";
import { requiredRule } from "@/components/forms/formRules";
import { pickImagePath, type ImageSourceType } from "@/utils/imagePicker";

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
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: requiredRule(required) }}
      render={({ field, fieldState }) => (
        <AppImagePickerField
          field={field}
          fieldState={fieldState}
          label={label}
          optional={optional}
        />
      )}
    />
  );
}

type AppImagePickerFieldProps<TFormValues extends FieldValues> = {
  field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
  fieldState: ControllerFieldState;
  label: string;
  optional?: boolean;
};

function AppImagePickerField<TFormValues extends FieldValues>({
  field,
  fieldState,
  label,
  optional,
}: AppImagePickerFieldProps<TFormValues>) {
  const [error, setError] = useState("");
  const [sheetVisible, setSheetVisible] = useState(false);
  const value = String(field.value ?? "");
  const errorText = error || fieldState.error?.message;
  const labelText = getLabelText(label, optional);
  const closeSheet = () => {
    setSheetVisible(false);
    field.onBlur();
  };

  const openSheet = () => {
    setSheetVisible(true);
  };

  const clearImage = () => {
    field.onChange("");
    field.onBlur();
  };

  const pickImage = async (sourceType: ImageSourceType) => {
    setSheetVisible(false);
    setError("");
    await waitForSheetDismiss();
    try {
      const image = await pickImagePath(sourceType);
      if (!image) return;

      field.onChange(image);
      field.onBlur();
    } catch (pickerError) {
      console.error(pickerError);
      setError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  return (
    <Box className="app-image-picker">
      <Text className="form-label">{labelText}</Text>
      <Box className="app-image-picker-frame">
        <Box
          className="app-image-picker-trigger"
          aria-label={getPickerAriaLabel(value)}
          onClick={openSheet}
        >
          <ImagePickerContent label={label} value={value} />
        </Box>
        {value && (
          <Button
            className="app-image-picker-clear"
            htmlType="button"
            aria-label="Xóa ảnh"
            icon={<Icon icon="zi-close" />}
            variant="tertiary"
            onClick={clearImage}
          />
        )}
      </Box>
      <AppActionSheet
        actions={[
          {
            key: "album",
            text: "Chọn ảnh",
            close: true,
            onClick: () => pickImage("album"),
          },
          {
            key: "camera",
            text: "Chụp ảnh",
            close: true,
            onClick: () => pickImage("camera"),
          },
        ]}
        visible={sheetVisible}
        unmountOnClose={false}
        onClose={closeSheet}
      />
      {errorText && <Text className="app-error-text">{errorText}</Text>}
    </Box>
  );
}

type ImagePickerContentProps = {
  label: string;
  value: string;
};

function ImagePickerContent({ label, value }: ImagePickerContentProps) {
  if (!value) {
    return (
      <Box className="app-image-picker-empty">
        <Box className="app-image-picker-plus">
          <Icon icon="zi-plus" />
        </Box>
      </Box>
    );
  }

  return <img alt={label} className="app-image-picker-image" src={value} />;
}

function getLabelText(label: string, optional?: boolean) {
  if (!optional) return label;

  return `${label} (không bắt buộc)`;
}

function getPickerAriaLabel(value: string) {
  if (!value) return "Chọn ảnh";

  return "Đổi ảnh";
}

function waitForSheetDismiss() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 180);
  });
}
