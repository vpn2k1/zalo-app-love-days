import { FormProvider } from "react-hook-form";

import { AppSpinner, Box } from "@/components/zaui";

import { MemoryDetailForm } from "./items/MemoryDetailForm";
import { MemoryDetailMissingState } from "./items/MemoryDetailMissingState";
import { useFormValuesMemory } from "./modules/useFormValuesMemory";

export function MemoryDetail() {
  const page = useFormValuesMemory();

  if (page.loading) return <MemoryDetailLoadingState />;
  if (page.missing) return <MemoryDetailMissingState />;

  return (
    <FormProvider {...page.forms}>
      <MemoryDetailForm />
    </FormProvider>
  );
}

function MemoryDetailLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}
