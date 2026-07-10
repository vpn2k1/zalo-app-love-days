import { AppPageHeader } from "@/components/AppPageHeader";

type Props = {
  onBack: () => void;
};

export function EditProfileHeader({ onBack }: Props) {
  return (
    <AppPageHeader
      title="Hồ sơ của bạn"
      subtitle="Cập nhật tên và ảnh đại diện trên trang kỷ niệm"
      onBack={onBack}
    />
  );
}
