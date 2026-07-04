import { Button, Icon } from "@/components/zaui";
import { homeStyles } from "../modules/inlineStyles";

export function MemoryChips() {
  return (
    <div style={homeStyles.chipRow}>
      <Button htmlType="button" style={{ ...homeStyles.chip, ...homeStyles.chipDark }}>
        <Icon icon="zi-edit" /> Love note
      </Button>
      <Button htmlType="button" style={{ ...homeStyles.chip, ...homeStyles.chipLight }}>
        <Icon icon="zi-notif" /> Reminder
      </Button>
    </div>
  );
}
