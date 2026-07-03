import { useForm } from "react-hook-form";
import { Button, Icon, Page, Text } from "zmp-ui";
import { AppDatePicker, AppImagePicker, AppTextInput } from "@/components/forms";
import type { AppUser } from "@/types/user";
import { StatusBar } from "./home/StatusBar";
import "../css/app.css";

type Props = {
  user: AppUser;
  startDate?: string;
  loading?: boolean;
  leaveLoading?: boolean;
  onSave: (payload: {
    display_name: string;
    custom_avatar_url: string | null;
    start_date: string;
  }) => Promise<void>;
  onBack: () => void;
  onLeave?: () => Promise<void>;
};

export function EditProfilePage({
  user,
  startDate,
  loading,
  leaveLoading,
  onSave,
  onBack,
  onLeave,
}: Props) {
  const { control, handleSubmit } = useForm<{
    display_name: string;
    custom_avatar_url: string;
    start_date: string;
  }>({
    defaultValues: {
      display_name: user.display_name || user.name,
      custom_avatar_url: user.custom_avatar_url || "",
      start_date: startDate || "",
    },
  });

  const submit = (values: {
    display_name: string;
    custom_avatar_url: string;
    start_date: string;
  }) =>
    onSave({
      display_name: values.display_name.trim(),
      custom_avatar_url: values.custom_avatar_url.trim() || null,
      start_date: values.start_date,
    });

  return (
    <Page className="app-setup-page">
      <form onSubmit={handleSubmit(submit)}>
        <StatusBar />

        <section className="app-setup-hero">
          <div className="app-opening-pill">
            <Icon icon="zi-user" />
            <span>Hồ sơ</span>
          </div>
          <Text.Title size="large">Chỉnh lại góc nhỏ của hai bạn</Text.Title>
          <Text className="app-opening-copy">
            Cập nhật tên, ảnh đại diện và ngày bắt đầu yêu.
          </Text>
          <span className="app-setup-spark">✣</span>
        </section>

        <section className="app-setup-card">
          <div className="app-setup-user">
            <span className="app-setup-avatar">
              {user.custom_avatar_url || user.avatar_url ? (
                <img src={user.custom_avatar_url || user.avatar_url || ""} alt="" />
              ) : (
                <Icon icon="zi-user" />
              )}
            </span>
            <div>
              <Text className="app-opening-card-title">
                {user.display_name || user.name}
              </Text>
              <Text className="app-opening-card-copy">
                Những thay đổi này sẽ hiện trên trang kỷ niệm.
              </Text>
            </div>
          </div>
        </section>

        <section className="app-setup-card">
          <div className="app-setup-form">
          <AppTextInput
            control={control}
            name="display_name"
            label="Tên hiển thị"
          />
          <AppImagePicker
            control={control}
            name="custom_avatar_url"
            label="Ảnh đại diện tuỳ chỉnh"
            optional
          />
          <AppDatePicker control={control} name="start_date" label="Ngày bắt đầu" required />
          </div>
        </section>

        {onLeave && (
          <section className="app-setup-card">
            <Text className="app-opening-card-title">Rời Love Days</Text>
            <Text className="app-opening-card-copy">
              Bạn sẽ quay lại màn thiết lập và có thể tạo hành trình mới.
            </Text>
            <Button
              fullWidth
              type="danger"
              variant="secondary"
              loading={leaveLoading}
              onClick={() => void onLeave()}
            >
              Rời phòng hiện tại
            </Button>
          </section>
        )}

        <div className="app-setup-action app-edit-actions">
          <Button variant="secondary" onClick={onBack}>
            Quay lại
          </Button>
          <Button htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </div>
      </form>
    </Page>
  );
}
