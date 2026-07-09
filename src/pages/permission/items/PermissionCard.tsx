import { Box, Icon, Text } from "@/components/zaui";

type Props = {
  copy: string;
  title: string;
};

export function PermissionCard({ copy, title }: Props) {
  return (
    <Box className="app-opening-card app-permission-card flex min-h-[220px] flex-col items-center justify-center gap-4">
      <Box className="w-full text-center flex items-center justify-center">
        <Text.Title size="small"> {title}</Text.Title>
        <Icon icon="zi-heart-solid" className="text-red-500" />
      </Box>

      <Box className="w-full text-center">
        <Text className="app-card-copy">{copy}</Text>
      </Box>
    </Box>
  );
}
