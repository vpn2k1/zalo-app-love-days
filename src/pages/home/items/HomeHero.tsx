import { Box, Icon, Text } from "@/components/zaui";
import { homeStyles } from "../modules/inlineStyles";

export function HomeHero() {
  return (
    <Box style={homeStyles.hero}>
      <div style={homeStyles.heroIcon}>
        <Icon icon="zi-user" />
      </div>
      <Text style={homeStyles.heroCopy}>Add your favorite couple photo</Text>
    </Box>
  );
}
