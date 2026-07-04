import { Avatar, Box, Icon, Text } from "@/components/zaui";
import type { Person } from "../types/HomePageType";

type Props = {
  person?: Person;
  emptyLabel?: string;
  onClick?: () => void;
};

export function PersonChip({ person, emptyLabel, onClick }: Props) {
  const avatarSrc = person?.avatar || undefined;

  return (
    <Box className="flex flex-col items-center gap-2">
      <Avatar
        size={70}
        src={avatarSrc}
        className="rounded-full"
        onClick={onClick}
      >
        <Icon icon="zi-user" />
      </Avatar>

      <Text className="text-center">
        {person?.name ?? emptyLabel ?? "Đang chờ"}
      </Text>
    </Box>
  );
}
