import { Box, Icon, Text } from "@/components/zaui";
import { homeStyles } from "../modules/inlineStyles";

export function StatusBar() {
  return (
    <div style={homeStyles.status}>
      <Text>9:41</Text>
      <Box style={homeStyles.statusIcons}>
        <Icon icon="zi-more-grid" />
        <Icon icon="zi-search" />
        <Icon icon="zi-close" />
      </Box>
    </div>
  );
}
