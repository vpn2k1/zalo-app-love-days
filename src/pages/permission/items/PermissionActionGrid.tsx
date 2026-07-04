import { Box, Icon, Text } from "@/components/zaui";
import type { ZmpIconName } from "@/pages/home/types/HomePageType";

const items: Array<{ icon: ZmpIconName; label: string }> = [
  { icon: "zi-user", label: "Tạo hồ sơ" },
  { icon: "zi-members", label: "Ghép đôi" },
  { icon: "zi-calendar", label: "Đếm ngày" },
  { icon: "zi-shield-solid", label: "Riêng tư" },
];

export function PermissionActionGrid() {
  return (
    <Box className="app-actions app-opening-actions">
      {items.map((item) => (
        <Box className="app-action" key={item.label}>
          <Icon icon={item.icon} />
          <Text>{item.label}</Text>
        </Box>
      ))}
    </Box>
  );
}
