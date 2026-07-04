import { Button, Icon, Text } from "@/components/zaui";
import { actionStyle, homeStyles } from "../modules/inlineStyles";
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
    <div style={homeStyles.actions}>
      {actions.map((action, index) => (
        <Button
          htmlType="button"
          key={action.label}
          onClick={() => void action.onClick()}
          style={actionStyle(index)}
        >
          <Icon icon={action.icon} />
          <Text style={homeStyles.actionLabel}>{action.label}</Text>
        </Button>
      ))}
    </div>
  );
}
