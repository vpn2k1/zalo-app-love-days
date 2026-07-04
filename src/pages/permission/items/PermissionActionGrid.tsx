import { Icon, Text } from "@/components/zaui";
import type { ZmpIconName } from "@/pages/home/types/HomePageType";

const items: Array<{ icon: ZmpIconName; label: string }> = [
  { icon: "zi-calendar", label: "Ngày yêu" },
  { icon: "zi-note", label: "Kỷ niệm" },
  { icon: "zi-chat", label: "Ghi chú" },
  { icon: "zi-shield-solid", label: "Riêng tư" },
];

export function PermissionActionGrid() {
  return (
    <div className="app-actions app-opening-actions">
      {items.map((item) => (
        <div className="app-action" key={item.label}>
          <Icon icon={item.icon} />
          <Text>{item.label}</Text>
        </div>
      ))}
    </div>
  );
}
