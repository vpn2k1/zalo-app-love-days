import { useState } from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";

import { AppImageViewer, AppSheet, Box, Text } from "@/components/zaui";
import { pickImagePath, pickImagePaths } from "@/utils/imagePicker";

import { AppCameraCapture } from "./AppCameraCapture";
import { AppImageMultiPickerGrid } from "./AppImageMultiPickerGrid";
import { AppImagePickerSheet } from "./AppImagePickerSheet";
import {
  appendImages,
  getGridStyle,
  getLabelText,
  waitForSheetDismiss,
} from "./appImageMultiPickerUtils";
import { useAppImageMultiPickerField } from "./useAppImageMultiPickerField";

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  label: string;
  maxCount?: number;
  name: Path<TFormValues>;
  optional?: boolean;
  required?: boolean | string;
  tileMinWidth?: number;
};

const DEFAULT_MAX_COUNT = 10;
const DEFAULT_TILE_MIN_WIDTH = 92;

export function AppImageMultiPicker<TFormValues extends FieldValues>({
  control,
  label,
  maxCount = DEFAULT_MAX_COUNT,
  name,
  optional,
  required,
  tileMinWidth = DEFAULT_TILE_MIN_WIDTH,
}: Props<TFormValues>) {
  const { error, field } = useAppImageMultiPickerField({
    control,
    maxCount,
    name,
    required,
  });

  return (
    <AppImageMultiPickerField
      errorText={error}
      images={field.value}
      label={label}
      labelText={getLabelText(label, optional)}
      maxCount={maxCount}
      tileMinWidth={tileMinWidth}
      onBlur={field.onBlur}
      onChange={field.onChange}
    />
  );
}

type FieldProps = {
  errorText?: string;
  images: string[];
  label: string;
  labelText: string;
  maxCount: number;
  tileMinWidth: number;
  onBlur: () => void;
  onChange: (images: string[]) => void;
};

function AppImageMultiPickerField({
  errorText,
  images,
  label,
  labelText,
  maxCount,
  tileMinWidth,
  onBlur,
  onChange,
}: FieldProps) {
  const [error, setError] = useState("");
  const [cameraVisible, setCameraVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const gridStyle = getGridStyle(tileMinWidth);
  const visibleError = error || errorText;
  const canAdd = images.length < maxCount;

  const closeSheet = () => {
    setSheetVisible(false);
    onBlur();
  };
  const openSheet = () => {
    if (!canAdd) {
      setError(`Chỉ chọn tối đa ${maxCount} ảnh.`);
      return;
    }

    setSheetVisible(true);
  };
  const pickAlbum = async () => {
    setSheetVisible(false);
    setError("");
    await waitForSheetDismiss();
    try {
      const pickedImages = await pickImagePaths(
        "album",
        maxCount - images.length,
      );
      if (pickedImages.length === 0) return;

      onChange(appendImages(images, pickedImages, maxCount));
      onBlur();
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
  const closeCamera = () => {
    setCameraVisible(false);
  };
  const pickAlbumFromCamera = () => {
    return pickImagePath("album");
  };
  const captureImage = (imageUrl: string) => {
    onChange(appendImages(images, [imageUrl], maxCount));
    onBlur();
    closeCamera();
  };
  const removeImage = (index: number) => {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
    onBlur();
  };
  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerVisible(false);
  };

  return (
    <Box>
      <Box className="mb-2 flex items-center justify-between gap-3">
        <Text className="form-label">{labelText}</Text>
      </Box>
      <Box className="grid gap-2 items-center justify-center" style={gridStyle}>
        <AppImageMultiPickerGrid
          images={images}
          label={label}
          showAdd={canAdd}
          onAdd={openSheet}
          onOpen={openViewer}
          onRemove={removeImage}
        />
      </Box>
      <Text className="text-xs font-bold text-[#9b6f86]">
        {images.length}/{maxCount}
      </Text>
      {visibleError && <Text className="app-error-text">{visibleError}</Text>}
      <AppSheet
        className="app-image-picker-sheet-host"
        autoHeight
        visible={sheetVisible}
        unmountOnClose={false}
        onClose={closeSheet}
      >
        <AppImagePickerSheet
          onClose={closeSheet}
          onPickAlbum={pickAlbum}
          onOpenCamera={openCamera}
        />
      </AppSheet>
      <AppCameraCapture
        visible={cameraVisible}
        onCapture={captureImage}
        onClose={closeCamera}
        onPickAlbum={pickAlbumFromCamera}
      />
      <AppImageViewer
        activeIndex={viewerIndex}
        images={images}
        visible={viewerVisible}
        onClose={closeViewer}
      />
    </Box>
  );
}
