import { Avatar, Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  title: string;
  subtitle: string;
  onEditProfile: () => void;
  avatar?: string;
};

export function HomeHeader({ title, subtitle, onEditProfile, avatar }: Props) {
  return (
    <Box className="mb-[13px] flex items-center gap-2">
      <Box aria-label="Mở hồ sơ" onClick={onEditProfile}>
        <Avatar size={40} src={avatar} className="rounded-full">
          <Icon icon="zi-user" />
        </Avatar>
      </Box>
      <Box>
        <Text.Title
          size="large"
          className="font-serif text-[18px] font-medium text-[#2f1d2a]"
        >
          {title}
        </Text.Title>
        <Text className="text-xs font-semibold text-[#8f7485]">{subtitle}</Text>
      </Box>
    </Box>
  );
}
