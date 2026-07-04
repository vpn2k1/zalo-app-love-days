import { Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  title: string;
  subtitle: string;
  onEditProfile: () => void;
};

export function HomeHeader({ title, subtitle, onEditProfile }: Props) {
  return (
    <Box className="mb-[13px] flex items-center justify-between">
      <Box>
        <Text.Title
          size="large"
          className="font-serif text-[18px] font-medium text-[#2f1d2a]"
        >
          {title}
        </Text.Title>
        <Text className="text-xs font-semibold text-[#8f7485]">{subtitle}</Text>
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
