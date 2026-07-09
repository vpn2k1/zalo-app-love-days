import { Box, Icon, Text } from "@/components/zaui";

export function SetupPageHeader() {
  return (
    <Box className="app-setup-hero">
      <Box className="app-opening-pill">
        <Icon icon="zi-heart" />
        <Text>Thiết lập</Text>
      </Box>
      <Text.Title size="large">
        Câu chuyện của hai bạn bắt đầu từ đây
      </Text.Title>
      <Text className="app-opening-copy">
        Xác nhận thông tin của bạn, ngày bắt đầu và vài kỷ niệm đầu tiên.
      </Text>
    </Box>
  );
}
