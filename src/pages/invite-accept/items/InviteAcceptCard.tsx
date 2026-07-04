import { Box, Icon, Text } from "@/components/zaui";

export function InviteAcceptCard() {
  return (
    <section className="app-opening-card">
      <div>
        <Text.Title size="small">Cùng lưu giữ hành trình</Text.Title>
        <Text className="app-card-copy">
          Nhận lời mời để đếm ngày bên nhau, thêm kỷ niệm và lưu dấu mốc riêng.
        </Text>
      </div>
      <Box className="app-small-heart">
        <Icon icon="zi-add-user" />
      </Box>
    </section>
  );
}
