import { Box, Icon, Text } from "zmp-ui";

export function SetupPageHeader() {
  return (
    <Box className="app-setup-hero">
      <div className="app-opening-pill">
        <Icon icon="zi-heart" />
        <Text>Thiết lập</Text>
      </div>
      <Text.Title size="large">
        Câu chuyện của hai bạn bắt đầu từ đây
      </Text.Title>
      <Text className="app-opening-copy">
        Xác nhận thông tin của bạn, ngày bắt đầu và vài kỷ niệm đầu tiên.
      </Text>
      <Icon icon="zi-heart" className="app-setup-spark" />
    </Box>
  );
}
