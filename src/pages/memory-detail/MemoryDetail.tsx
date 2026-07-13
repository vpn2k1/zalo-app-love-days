import { FormProvider } from "react-hook-form";

import { MemoryDetailForm } from "./items/MemoryDetailForm";
import { MemoryDetailMissingState } from "./items/MemoryDetailMissingState";
import { useFormValuesMemory } from "./modules/useFormValuesMemory";

export function MemoryDetail() {
  const page = useFormValuesMemory();

  if (page.mode !== "create" && !page.memoryQuery.data) {
    return <MemoryDetailMissingState />;
  }

  return (
    <FormProvider {...page.forms}>
      <MemoryDetailForm />
    </FormProvider>
  );
}
