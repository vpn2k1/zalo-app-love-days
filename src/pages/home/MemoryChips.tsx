import { Icon } from "zmp-ui";

export function MemoryChips() {
  return (
    <div className="app-chip-row">
      <button type="button" className="app-chip app-chip-dark">
        <Icon icon="zi-edit" /> Love note
      </button>
      <button type="button" className="app-chip">
        <Icon icon="zi-notif" /> Reminder
      </button>
    </div>
  );
}
