import type { AnniversaryUpdateInput } from "@/types/anniversary";

export type MemoryDetailMode = "create" | "update";

export type MemoryDetailFormValues = AnniversaryUpdateInput & {
  couple_id: string;
  created_by: string;
  id: string;
  mode: MemoryDetailMode;
};

export type MemoryDetailFormProps = {
  canDelete?: boolean;
  mode: MemoryDetailMode;
  onBack: () => void;
  onDelete?: () => void;
};
