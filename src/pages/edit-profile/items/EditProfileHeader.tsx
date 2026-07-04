import { Icon, Text } from "@/components/zaui";

export function EditProfileHeader() {
  return (
    <section className="app-setup-hero">
      <div className="app-opening-pill">
        <Icon icon="zi-user" />
        <Text>Hồ sơ</Text>
      </div>
      <Text.Title size="large">Chỉnh lại góc nhỏ của hai bạn</Text.Title>
      <Text className="app-opening-copy">
        Cập nhật tên và ảnh đại diện sẽ hiện trên trang kỷ niệm.
      </Text>
      <Text className="app-setup-spark">✣</Text>
    </section>
  );
}
