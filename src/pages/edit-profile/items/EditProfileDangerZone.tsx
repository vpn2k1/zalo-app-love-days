import { Button } from "@/components/zaui";

type Props = {
  disabled?: boolean;
  onOpenConfirm: () => void;
};

export function EditProfileDangerZone({ disabled, onOpenConfirm }: Props) {
  return (
    <section className="app-danger-zone">
      <Button
        fullWidth
        variant="secondary"
        htmlType="button"
        disabled={disabled}
        onClick={onOpenConfirm}
      >
        Rời khỏi Love Days
      </Button>
    </section>
  );
}
