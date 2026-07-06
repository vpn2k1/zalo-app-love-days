import { useState } from "react";

import { Avatar, Box, Icon, Text, AppImageViewer } from "@/components/zaui";

import type { Person } from "../types/HomePageType";

type Props = {
  person?: Person;
  emptyLabel?: string;
  onEmptyClick?: () => void;
};

export function PersonChip({ person, emptyLabel, onEmptyClick }: Props) {
  const avatarSrc = person?.avatar || undefined;
  const [showImageViewer, setShowImageViewer] = useState(false);

  const handleAvatarClick = () => {
    if (avatarSrc) {
      setShowImageViewer(true);
      return;
    }

    onEmptyClick?.();
  };

  return (
    <>
      <Box className="flex flex-col items-center gap-2 max-w-[120px] min-w-0">
        <Avatar
          size={70}
          src={avatarSrc}
          className="rounded-full"
          onClick={handleAvatarClick}
        >
          <Icon icon="zi-user" />
        </Avatar>

        <Text className="text-center text-sm break-words whitespace-normal max-w-full">
          {person?.name ?? emptyLabel ?? "Đang chờ"}
        </Text>
      </Box>

      {avatarSrc && showImageViewer && (
        <AppImageViewer
          images={[avatarSrc]}
          visible={showImageViewer}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  );
}
