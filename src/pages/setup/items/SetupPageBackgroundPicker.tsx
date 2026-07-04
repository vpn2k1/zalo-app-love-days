import { useFormContext } from "react-hook-form";
import { useAppSnackbar } from "@/components/zaui";
import { pickImagePath } from "@/utils/imagePicker";
import { Box, Button, Icon, Text } from "zmp-ui";

export function SetupPageBackgroundPicker() {
  const snackbar = useAppSnackbar();
  const { setValue } = useFormContext();
  const pickBackground = async () => {
    try {
      const image = await pickImagePath();
      if (image) setValue("backgroundUrl", image, { shouldDirty: true });
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };
  return (
    <Box className="app-setup-card  flex gap-4">
      <Box
        className="app-hero flex flex-1 items-center justify-center"
        aria-label="Chọn ảnh nền"
        onClick={pickBackground}
      >
        <Icon icon="zi-members" size={60} className="text-white" />
      </Box>
      <Box className="app-setup-user-copy">
        <Text className="app-opening-card-title">Ảnh cặp đôi</Text>
        <Text className="app-opening-card-copy">
          Có thể thêm sau, nhưng một tấm ảnh sẽ làm màn Home ngọt hơn.
        </Text>
        <Button
          htmlType="button"
          className="app-setup-add-photo"
          onClick={pickBackground}
        >
          <Text>+ Ảnh cặp đôi</Text>
        </Button>
      </Box>
    </Box>
  );
}
