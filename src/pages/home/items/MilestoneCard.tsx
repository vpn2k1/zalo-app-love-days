import { Box, Icon, Text } from "@/components/zaui";
import { homeStyles } from "../modules/inlineStyles";
import type { ZmpIconName } from "../types/HomePageType";

type Props = {
  icon: ZmpIconName;
  title: string;
  label: string;
  value: string;
};

export function MilestoneCard({ icon, title, label, value }: Props) {
  return (
    <Box style={homeStyles.milestone}>
      <Box style={homeStyles.milestoneIcon}>
        <Icon icon={icon} />
      </Box>
      <Text style={homeStyles.muted}>{title}</Text>
      <Text style={homeStyles.milestoneValue}>{value}</Text>
      <Text style={homeStyles.muted}>{label}</Text>
    </Box>
  );
}
