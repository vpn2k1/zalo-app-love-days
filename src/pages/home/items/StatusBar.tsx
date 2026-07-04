import { Box, Icon, Text } from "@/components/zaui";

export function StatusBar() {
  return (
    <Box className="mx-1.5 mb-[17px] flex items-center justify-between">
      <Text>9:41</Text>
      <Box className="flex gap-[5px] text-sm">
        <Icon icon="zi-more-grid" />
        <Icon icon="zi-search" />
        <Icon icon="zi-close" />
      </Box>
    </Box>
  );
}
