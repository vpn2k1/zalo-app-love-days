import { Icon } from "zmp-ui";
import type { Person } from "./types";

type Props = {
  person?: Person;
  label: string;
  emptyLabel?: string;
  onClick?: () => void;
};

export function PersonChip({ person, label, emptyLabel, onClick }: Props) {
  return (
    <button
      type="button"
      className="app-person"
      onClick={onClick}
      disabled={!onClick}
    >
      <span className="app-avatar">
        {person?.avatar ? (
          <img src={person.avatar} alt="" />
        ) : (
          <Icon icon="zi-user" />
        )}
      </span>
      <span className="app-person-name">{person?.name ?? emptyLabel ?? "Đang chờ"}</span>
      <span className="app-person-label">{label}</span>
    </button>
  );
}
