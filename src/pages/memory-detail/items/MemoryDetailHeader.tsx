import { Box, Text } from "@/components/zaui";
import { formatDate } from "@/utils/date";
import type { MemoryDetailFormProps } from "../types/MemoryDetailPageType";

export function MemoryDetailHeader({ memory }: MemoryDetailFormProps) {
  return (
    <Box className="mb-4 rounded-[24px] border border-[var(--love-border)] bg-white/85 p-3.5 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Text className="text-xs font-bold uppercase text-[#c45a86]">
        Chi tiết kỷ niệm
      </Text>
      <Text.Title size="small" className="mt-1 font-serif text-[#2f1d2a]">
        {memory.title}
      </Text.Title>
      <Text className="mt-1 text-xs font-bold text-[#8b6b7d]">
        {formatDate(memory.date)}
      </Text>
    </Box>
  );
}
