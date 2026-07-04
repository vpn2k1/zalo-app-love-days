import { Button, Text } from "@/components/zaui";

type Props = {
  actionLabel: string;
  loading?: boolean;
  onAllow: () => void;
};

export function PermissionAllowAction({
  actionLabel,
  loading,
  onAllow,
}: Props) {
  return (
    <div className="app-opening-action">
      <Button fullWidth loading={loading} onClick={onAllow}>
        {actionLabel}
      </Button>
      <Text className="app-opening-note">
        An toàn, riêng tư và có thể chỉnh sau.
      </Text>
    </div>
  );
}
