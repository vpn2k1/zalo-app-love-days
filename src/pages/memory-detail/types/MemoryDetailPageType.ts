import type { Anniversary, AnniversaryUpdateInput } from "@/types/anniversary";

export type MemoryDetailFormValues = AnniversaryUpdateInput;

export type MemoryDetailFormProps = {
  memory: Anniversary;
  onBack: () => void;
};
