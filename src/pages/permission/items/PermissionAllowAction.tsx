import { Box, Button, Icon } from "@/components/zaui";

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
    <Box className="mt-4">
      <Button fullWidth loading={loading} onClick={onAllow}>
        {actionLabel}
      </Button>
    </Box>
  );
}
