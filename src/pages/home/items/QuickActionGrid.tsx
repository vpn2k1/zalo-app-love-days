import { Box, Button, Icon, Text } from "@/components/zaui";
import type { ZmpIconName } from "../types/HomePageType";

type Props = {
  onEditProfile: () => void;
  onAddPartner: () => Promise<unknown>;
  onAddAnniversary: () => void;
  addPartnerLoading?: boolean;
};

export function QuickActionGrid({
  onEditProfile,
  onAddPartner,
  onAddAnniversary,
  addPartnerLoading,
}: Props) {
  let inviteLabel = "Anniversary";
  if (addPartnerLoading) {
    inviteLabel = "Sharing";
  }
  const actions: Array<{
    icon: ZmpIconName;
    label: string;
    onClick: () => void | Promise<unknown>;
  }> = [
    { icon: "zi-calendar", label: "Calendar", onClick: onAddAnniversary },
    { icon: "zi-note", label: "Memories", onClick: onAddAnniversary },
    { icon: "zi-chat", label: "Love notes", onClick: onEditProfile },
    {
      icon: "zi-add-user",
      label: inviteLabel,
      onClick: onAddPartner,
    },
  ];

  return (
    <Box className="mb-4 grid grid-cols-4 gap-1.5">
      {actions.map((action, index) => (
        <Button
          htmlType="button"
          key={action.label}
          onClick={() => void action.onClick()}
          className={getActionClassName(index)}
        >
          <Icon icon={action.icon} />
          <Text className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-extrabold text-[#684e5f]">
            {action.label}
          </Text>
        </Button>
      ))}
    </Box>
  );
}

function getActionClassName(index: number) {
  if (index === 1) {
    return "h-[66px] min-w-0 rounded-[18px] border-0 bg-[#efe6ff] px-[5px] pb-2 pt-2.5 text-[#7d62d8]";
  }
  if (index === 2) {
    return "h-[66px] min-w-0 rounded-[18px] border-0 bg-[#fff7eb] px-[5px] pb-2 pt-2.5 text-[#d77a32]";
  }
  if (index === 3) {
    return "h-[66px] min-w-0 rounded-[18px] border-0 bg-[#efe6ff] px-[5px] pb-2 pt-2.5 text-[#7d62d8]";
  }

  return "h-[66px] min-w-0 rounded-[18px] border-0 bg-white/90 px-[5px] pb-2 pt-2.5 text-[#d9467e]";
}
