import { AppPageHeader } from "@/components/AppPageHeader";

type Props = {
  onBack: () => void;
};

export function CalendarMemoriesHeader({ onBack }: Props) {
  return (
    <AppPageHeader
      title="Lịch kỷ niệm"
      subtitle="Chạm vào một ngày để xem chi tiết"
      onBack={onBack}
    />
  );
}
