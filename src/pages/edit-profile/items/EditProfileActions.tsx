import { Box, Button } from "@/components/zaui";

type Props = {
  loading?: boolean;
  onBack: () => void;
  onSave: () => void;
};

export function EditProfileActions({ loading, onBack, onSave }: Props) {
  return (
    <Box className="app-setup-action app-edit-actions">
      <Button
        variant="secondary"
        htmlType="button"
        disabled={loading}
        onClick={onBack}
      >
        Quay lại
      </Button>
      <Button htmlType="button" loading={loading} onClick={onSave}>
        Lưu
      </Button>
    </Box>
  );
}
