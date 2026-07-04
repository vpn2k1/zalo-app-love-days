import { AppSpinner, Box, Text } from "@/components/zaui";

type Props = {
  show: boolean;
  message: string;
};

export function BlockingLoadingOverlay({ show, message }: Props) {
  if (!show) return null;

  return (
    <Box className="app-blocking-overlay" role="alert" aria-live="assertive">
      <Box className="app-blocking-dialog">
        <AppSpinner />
        <Text.Title size="small">Chờ một chút</Text.Title>
        <Text>{message}</Text>
      </Box>
    </Box>
  );
}
