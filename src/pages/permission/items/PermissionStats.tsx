import { Box, Text } from "@/components/zaui";

type Props = {
  dayTitle: string;
};

export function PermissionStats({ dayTitle }: Props) {
  return (
    <Box className="app-opening-days app-alternate-intro-counter">
      <Text.Title size="large">{dayTitle}</Text.Title>
      <Text>ngày bên nhau</Text>
    </Box>
  );
}
