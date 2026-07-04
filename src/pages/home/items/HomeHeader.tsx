import { Box, Button, Icon, Text } from "@/components/zaui";
import { homeStyles } from "../modules/inlineStyles";

type Props = {
  title: string;
  subtitle: string;
  onEditProfile: () => void;
};

export function HomeHeader({ title, subtitle, onEditProfile }: Props) {
  return (
    <Box style={homeStyles.header}>
      <Box>
        <Text.Title size="large" style={homeStyles.headerTitle}>{title}</Text.Title>
        <Text style={homeStyles.headerSubtitle}>{subtitle}</Text>
      </Box>
      <Box
        aria-label="Mở hồ sơ"
        onClick={onEditProfile}
      >
        <Icon icon="zi-user" />
      </Box>
    </Box>
  );
}
