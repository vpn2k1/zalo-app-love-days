import { requiredRule } from "@/components/forms/formRules";
import { AppSheet, Box } from "@/components/zaui";
import { pickImagePath, type ImageSourceType } from "@/utils/imagePicker";
import { ReactNode, useState } from "react";
import { AppCameraCapture } from "./AppCameraCapture";
import { AppImagePickerPreview } from "./AppImagePickerPreview";
import { AppImagePickerSheet } from "./AppImagePickerSheet";
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  optional?: boolean;
  required?: boolean | string;
  customs?: ReactNode;
};

export function AppImagePicker<TFormValues extends FieldValues>({
  control,
  name,
  label,
  optional,
  required,
  customs,
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
          customs={customs}
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
  customs?: ReactNode;
};

function AppImagePickerField<TFormValues extends FieldValues>({
  field,
  fieldState,
  label,
  optional,
  customs,
}: AppImagePickerFieldProps<TFormValues>) {
  const [error, setError] = useState("");
  const [cameraVisible, setCameraVisible] = useState(false);
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
  const openCamera = async () => {
    setSheetVisible(false);
    setError("");
    await waitForSheetDismiss();
    setCameraVisible(true);
  };
  const pickAlbumFromCamera = () => {
    return pickImagePath("album");
  };
  const closeCamera = () => {
    setCameraVisible(false);
  };
  const captureImage = (imageUrl: string) => {
    field.onChange(imageUrl);
    field.onBlur();
    closeCamera();
  };

  return (
    <Box>
      {!customs && (
        <AppImagePickerPreview
          errorText={errorText}
          label={label}
          labelText={labelText}
          value={value}
          onClear={clearImage}
          onOpen={openSheet}
        />
      )}
      {!!customs && (
        <Box aria-label={getCustomPickerAriaLabel(value)} onClick={openSheet}>
          {customs}
        </Box>
      )}
      <AppSheet
        className="app-image-picker-sheet-host"
        autoHeight
        visible={sheetVisible}
        unmountOnClose={false}
        onClose={closeSheet}
      >
        <AppImagePickerSheet
          onClose={closeSheet}
          onPickAlbum={() => pickImage("album")}
          onOpenCamera={openCamera}
        />
      </AppSheet>
      <AppCameraCapture
        visible={cameraVisible}
        onCapture={captureImage}
        onClose={closeCamera}
        onPickAlbum={pickAlbumFromCamera}
      />
    </Box>
  );
}

function getLabelText(label: string, optional?: boolean) {
  if (!optional) return label;

  return `${label} (không bắt buộc)`;
}

function getCustomPickerAriaLabel(value: string) {
  if (!value) return "Chọn ảnh";

  return "Đổi ảnh";
}

function waitForSheetDismiss() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 180);
  });
}
