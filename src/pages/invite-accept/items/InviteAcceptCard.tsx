import { Box, Icon, Text } from "@/components/zaui";

export function InviteAcceptCard() {
  return (
    <Box className="app-opening-card">
      <Box>
        <Text.Title size="small">Cùng lưu giữ hành trình</Text.Title>
        <Text className="app-card-copy">
          Nhận lời mời để đếm ngày bên nhau, thêm kỷ niệm và lưu dấu mốc riêng.
        </Text>
      </Box>
      <Box className="app-small-heart">
        <Icon icon="zi-add-user" />
      </Box>
    </Box>
  );
}
