import { useFormContext, useWatch } from "react-hook-form";
import { Box, Button, Icon, Text, useAppSnackbar } from "@/components/zaui";
import { pickImagePath } from "@/utils/imagePicker";

export function SetupPageBackgroundPicker() {
  const snackbar = useAppSnackbar();
  const { control, setValue } = useFormContext();
  const backgroundUrl = useWatch({ control, name: "backgroundUrl" }) || "";
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
    <Box className="app-setup-card flex gap-2">
      <Box
        className="app-hero relative flex flex-1 cursor-pointer items-center justify-center overflow-hidden"
        aria-label="Chọn ảnh nền"
      >
        {backgroundUrl && (
          <img
            alt="backgroundUrl"
            className="absolute inset-0 size-full object-cover"
            src={backgroundUrl}
          />
        )}
        {!backgroundUrl && (
          <Icon icon="zi-members" size={60} className="text-white" />
        )}
      </Box>
      <Box className="app-setup-user-copy">
        <Text className="app-opening-card-title">Ảnh cặp đôi</Text>
        <Text className="app-opening-card-copy">
          Có thể thêm sau, nhưng một tấm ảnh sẽ làm màn chính ngọt hơn.
        </Text>
        <Button className="" onClick={pickBackground}>
          <Text>+ Ảnh</Text>
        </Button>
      </Box>
    </Box>
  );
}
