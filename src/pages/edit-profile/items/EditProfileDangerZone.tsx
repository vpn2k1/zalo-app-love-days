import { Box, Button } from "@/components/zaui";

type Props = {
  disabled?: boolean;
  onOpenConfirm: () => void;
};

export function EditProfileDangerZone({ disabled, onOpenConfirm }: Props) {
  return (
    <Box className="my-4">
      <Button
        fullWidth
        variant="secondary"
        htmlType="button"
        disabled={disabled}
        onClick={onOpenConfirm}
      >
        Rời khỏi không gian
      </Button>
    </Box>
  );
}
