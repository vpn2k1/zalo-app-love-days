import { Box, Button, Icon, Text } from "@/components/zaui";
import type { MemoryDetailFormProps } from "../types/MemoryDetailPageType";

export function MemoryDetailHeader({ memory, onBack }: MemoryDetailFormProps) {
  return (
    <Box className="mb-3 flex items-center gap-2">
      <Button
        className="min-h-10 min-w-10 p-0 text-[#d9467e]"
        htmlType="button"
        icon={<Icon icon="zi-chevron-left" />}
        variant="tertiary"
        onClick={onBack}
      />
      <Text.Title size="small" className="font-serif text-[#2f1d2a]">
        Chi tiết kỷ niệm
      </Text.Title>
    </Box>
  );
}
