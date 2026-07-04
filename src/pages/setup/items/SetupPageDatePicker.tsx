import { AppDatePicker } from "@/components/forms";
import { Box } from "@/components/zaui";
import { useFormContext } from "react-hook-form";

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
