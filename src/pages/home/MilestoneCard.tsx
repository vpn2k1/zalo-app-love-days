import { Box, Icon, Text } from "zmp-ui";
import type { ZmpIconName } from "./types";

type Props = {
  icon: ZmpIconName;
  title: string;
  label: string;
  value: string;
};

export function MilestoneCard({ icon, title, label, value }: Props) {
  return (
    <Box className="app-milestone">
      <span className="app-milestone-icon">
        <Icon icon={icon} />
      </span>
      <Text className="app-muted">{title}</Text>
      <Text className="app-milestone-value">{value}</Text>
      <Text className="app-muted">{label}</Text>
    </Box>
  );
}
