import { Button } from "@/components/zaui";

type Props = {
  loading?: boolean;
  onBack: () => void;
};

export function EditProfileActions({ loading, onBack }: Props) {
  return (
    <div className="app-setup-action app-edit-actions">
      <Button
        variant="secondary"
        htmlType="button"
        disabled={loading}
        onClick={onBack}
      >
        Quay lại
      </Button>
      <Button htmlType="submit" loading={loading}>
        Lưu
      </Button>
    </div>
  );
}
