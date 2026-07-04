import { Box, Icon, Text } from "@/components/zaui";

type Props = {
  title: string;
};

export function PermissionHero({ title }: Props) {
  return (
    <Box className="app-opening-hero app-alternate-intro-hero">
      <Box className="app-alternate-pearl app-alternate-pearl-one" />
      <Box className="app-alternate-pearl app-alternate-pearl-two" />
      <Icon icon="zi-heart" className="app-alternate-floating-heart" />
      <Box className="app-alternate-hero-icon">
        <Icon icon="zi-heart" size={60} />
      </Box>
      <Text className="app-hero-copy">{title}</Text>
    </Box>
  );
}
