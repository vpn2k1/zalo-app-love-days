import { Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  errorText?: string;
  label: string;
  labelText: string;
  value: string;
  onClear: () => void;
  onOpen: () => void;
};

export function AppImagePickerPreview({
  errorText,
  label,
  labelText,
  value,
  onClear,
  onOpen,
}: Props) {
  return (
    <Box className="app-image-picker">
      <Text className="form-label">{labelText}</Text>
      <Box className="app-image-picker-frame">
        <Box
          className="app-image-picker-trigger"
          aria-label={getPickerAriaLabel(value)}
          onClick={onOpen}
        >
          <AppImagePickerContent label={label} value={value} />
        </Box>
        {value && (
          <Button
            className="app-image-picker-clear"
            htmlType="button"
            aria-label="Xóa ảnh"
            icon={<Icon icon="zi-close" />}
            variant="tertiary"
            onClick={onClear}
          />
        )}
      </Box>

      {errorText && <Text className="app-error-text">{errorText}</Text>}
    </Box>
  );
}

function AppImagePickerContent({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

function getPickerAriaLabel(value: string) {
  if (!value) return "Chọn ảnh";

  return "Đổi ảnh";
}
