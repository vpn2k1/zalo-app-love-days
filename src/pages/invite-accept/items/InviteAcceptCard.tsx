import { Box, Icon, Text } from "@/components/zaui";

export function InviteAcceptCard() {
  return (
    <Box className="grid gap-2 bg-white rounded-2xl p-4 items-center justify-center">
        <Text.Title size="small" className="text-[var(--love-primary)] text-center">Cùng lưu giữ hành trình</Text.Title>
        <Text className="app-card-copy text-center">
          Nhận lời mời để đếm ngày bên nhau, thêm kỷ niệm và lưu dấu mốc riêng.
        </Text>
    </Box>
  );
}
