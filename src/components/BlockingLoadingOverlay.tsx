import { AppSpinner, Text } from "@/components/zaui";

type Props = {
  show: boolean;
  message: string;
};

export function BlockingLoadingOverlay({ show, message }: Props) {
  if (!show) return null;

  return (
    <div className="app-blocking-overlay" role="alert" aria-live="assertive">
      <div className="app-blocking-dialog">
        <AppSpinner />
        <Text.Title size="small">Chờ một chút</Text.Title>
        <Text>{message}</Text>
      </div>
    </div>
  );
}
