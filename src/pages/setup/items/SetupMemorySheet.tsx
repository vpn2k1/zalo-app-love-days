import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AnniversaryForm } from "@/components/AnniversaryForm";
import { AnniversaryList } from "@/components/AnniversaryList";
import { AppSheet, Box, Button, Text } from "@/components/zaui";
import type { AppSheetRef } from "@/components/zaui";
import { SetupFormValues } from "../types/SetupPageType";

export function SetupMemorySheet() {
  const { control } = useFormContext<SetupFormValues>();
  const ref = useRef<AppSheetRef>(null);
  const { append, fields, remove } = useFieldArray({
    control,
    name: "anniversaries",
  });

  const openSheet = () => {
    ref.current?.open();
  };

  const closeSheet = () => {
    ref.current?.close();
  };

  const addAnniversary = (draft: SetupFormValues["anniversaries"][number]) => {
    append(draft);
    closeSheet();
  };

  return (
    <Box className="app-setup-card">
      <Button onClick={openSheet} className="w-full my-4">
        <Text>Thêm kỷ niệm</Text>
      </Button>
      <AnniversaryList anniversaries={fields} onRemove={remove} />
        <AppSheet ref={ref}>
          <AnniversaryForm onAdd={addAnniversary} close={closeSheet} />
        </AppSheet>
    </Box>
  );
}
