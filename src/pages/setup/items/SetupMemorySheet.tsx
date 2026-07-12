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
      <Button onClick={openSheet} className="my-4 w-full">
        <Text>Thêm kỷ niệm</Text>
      </Button>
      <AnniversaryList anniversaries={fields} onRemove={remove} />
      <AppSheet ref={ref}>
        <Box className="flex h-full min-h-0 flex-col overflow-hidden">
          <Box className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-2">
            <AnniversaryForm onAdd={addAnniversary} close={closeSheet} />
          </Box>
        </Box>
      </AppSheet>
    </Box>
  );
}
