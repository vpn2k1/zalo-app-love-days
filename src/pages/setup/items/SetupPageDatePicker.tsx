import { AppDatePicker } from "@/components/forms";
import { useFormContext } from "react-hook-form";
import { Box, Icon, Text } from "zmp-ui";

export function SetupPageDatePicker() {
  const { control } = useFormContext();
  return (
    <Box className="app-setup-card">
      <AppDatePicker
        control={control}
        name="startDate"
        label="Ngày bắt đầu"
        required
      />
    </Box>
  );
}
