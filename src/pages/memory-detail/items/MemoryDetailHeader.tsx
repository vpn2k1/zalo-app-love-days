import { AppPageHeader } from "@/components/AppPageHeader";

import type { MemoryDetailFormProps } from "../types/MemoryDetailPageType";

export function MemoryDetailHeader({ memory, onBack }: MemoryDetailFormProps) {
  return (
    <AppPageHeader
      title="Chi tiết kỷ niệm"
      subtitle={memory.title}
      onBack={onBack}
    />
  );
}
