import { Box, Icon, Text } from "@/components/zaui";

export function InviteAcceptHero() {
  return (
    <Box className="app-opening-hero">
      <Box className="app-hero-icon">
        <Icon icon="zi-heart" />
      </Box>
      <Text className="app-hero-copy">Người ấy đang chờ bạn tham gia</Text>
    </Box>
  );
}
