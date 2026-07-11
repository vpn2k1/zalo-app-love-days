import type { Anniversary, AnniversaryUpdateInput } from "@/types/anniversary";

export type MemoryDetailMode = "create" | "update";

export type MemoryDetailFormValues = AnniversaryUpdateInput;

export type MemoryDetailFormProps = {
  memory?: Anniversary;
  mode: MemoryDetailMode;
  onBack: () => void;
};
