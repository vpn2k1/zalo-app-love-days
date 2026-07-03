import { Icon } from "zmp-ui";
import type { ZmpIconName } from "./types";

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
      label: addPartnerLoading ? "Sharing" : "Anniversary",
      onClick: onAddPartner,
    },
  ];

  return (
    <div className="app-actions">
      {actions.map((action) => (
        <button
          type="button"
          className="app-action"
          key={action.label}
          onClick={() => void action.onClick()}
        >
          <Icon icon={action.icon} />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
