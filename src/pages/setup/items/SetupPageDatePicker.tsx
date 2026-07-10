import { AppCalendarPicker } from "@/components/forms";
import { Box } from "@/components/zaui";
import { useFormContext } from "react-hook-form";

export function SetupPageDatePicker() {
  const { control } = useFormContext();
  return (
    <Box className="app-setup-card">
      <AppCalendarPicker
        control={control}
        name="startDate"
        label="Ngày bắt đầu"
        required
      />
    </Box>
  );
}
