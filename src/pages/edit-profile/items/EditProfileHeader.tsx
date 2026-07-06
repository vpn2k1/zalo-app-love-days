import { Box, Icon, Text } from "@/components/zaui";

export function EditProfileHeader() {
  return (
    <Box className="app-setup-hero">
      <Box className="app-opening-pill">
        <Icon icon="zi-user" />
        <Text>Hồ sơ</Text>
      </Box>
      <Text.Title size="normal">Chỉnh lại góc nhỏ của bạn</Text.Title>
      <Text className="app-opening-copy">
        Cập nhật tên và ảnh đại diện sẽ hiện trên trang kỷ niệm.
      </Text>
      <Text className="app-setup-spark">✣</Text>
    </Box>
  );
}
