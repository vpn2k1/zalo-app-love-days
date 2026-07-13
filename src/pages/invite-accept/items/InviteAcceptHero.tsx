import { Box, Icon, Text } from "@/components/zaui";

export function InviteAcceptHero() {
  return (
    <Box className="app-opening-hero">
      <Box className="app-hero-icon">
        <Icon icon="zi-heart-solid" size={50} className="text-red-400" />
      </Box>
      <Text
        className="text-[var(--love-primary)] text-lg font-serif text-center"
      >
        Người ấy đang chờ bạn tham gia
      </Text>
    </Box>
  );
}
