import type { AnniversaryUpdateInput } from "@/types/anniversary";

export type MemoryDetailMode = "create" | "update";

export type MemoryDetailFormValues = AnniversaryUpdateInput & {
  couple_id: string;
  id: string;
  mode: MemoryDetailMode;
};

export type MemoryDetailFormProps = {
  mode: MemoryDetailMode;
  onBack: () => void;
};
