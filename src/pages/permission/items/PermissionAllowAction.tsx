import { Box, Button } from "@/components/zaui";

type Props = {
  actionLabel: string;
  loading?: boolean;
  onAllow: () => void;
  onSkip: () => void;
  skipLoading?: boolean;
};

export function PermissionAllowAction({
  actionLabel,
  loading,
  onAllow,
  onSkip,
  skipLoading,
}: Props) {
  return (
    <Box className="mt-4 flex flex-col gap-3">
      <Button fullWidth loading={loading} onClick={onAllow}>
        {actionLabel}
      </Button>
      <Button
        fullWidth
        loading={skipLoading}
        onClick={onSkip}
      >
        Tiếp tục không cấp quyền
      </Button>
    </Box>
  );
}
