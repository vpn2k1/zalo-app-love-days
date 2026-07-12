import { Box, Text } from "@/components/zaui";

export function AnniversaryEmptyState() {
  return (
    <Box className="empty-state">
      <Text>Chưa có ngày kỷ niệm riêng.</Text>
      <Text className="subtle">Bạn có thể thêm sau khi tạo.</Text>
    </Box>
  );
}
