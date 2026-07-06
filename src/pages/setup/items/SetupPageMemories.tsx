import { AnniversaryForm } from "@/components/AnniversaryForm";
import { AnniversaryList } from "@/components/AnniversaryList";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Box, Icon, Text } from "zmp-ui";
import type { SetupFormValues } from "../types/SetupPageType";

export function SetupPageMemories() {
  const { control } = useFormContext<SetupFormValues>();
  const { append, fields, remove } = useFieldArray({
    control,
    name: "anniversaries",
  });
  return (
    <Box className="app-setup-card app-setup-memory">
      <Box className="app-setup-section-head">
        <Text className="app-opening-card-title">Kỷ niệm đầu tiên</Text>
        <Icon icon="zi-calendar" />
      </Box>
      <AnniversaryForm onAdd={(draft) => append(draft)} />
      <AnniversaryList anniversaries={fields} onRemove={remove} />
    </Box>
  );
}
