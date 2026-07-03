import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button, Icon, Page, Text } from "zmp-ui";
import { AnniversaryForm } from "@/components/AnniversaryForm";
import { AnniversaryList } from "@/components/AnniversaryList";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppDatePicker, AppTextInput } from "@/components/forms";
import type { AnniversaryDraft } from "@/types/anniversary";
import type { SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { pickImagePath } from "@/utils/imagePicker";
import { StatusBar } from "./home/StatusBar";
import "../css/app.css";

type Props = {
  user: AppUser;
  loading?: boolean;
  error?: string;
  onCreate: (input: SetupCoupleInput) => Promise<void>;
};

type SetupFormValues = {
  startDate: string;
  displayName: string;
  customAvatarUrl: string;
  anniversaries: AnniversaryDraft[];
};

export function SetupCouplePage({ user, loading, error, onCreate }: Props) {
  const [editingName, setEditingName] = useState(false);
  const [imageError, setImageError] = useState("");
  const { control, handleSubmit, setValue, watch } = useForm<SetupFormValues>({
    defaultValues: {
      startDate: "",
      displayName: user.display_name || user.name,
      customAvatarUrl: user.custom_avatar_url || user.avatar_url || "",
      anniversaries: [],
    },
  });
  const { append, fields } = useFieldArray({
    control,
    name: "anniversaries",
  });
  const displayName = watch("displayName");
  const avatarUrl = watch("customAvatarUrl");
  const startDate = watch("startDate");
  const canStart = Boolean(startDate);

  const submit = (values: SetupFormValues) => {
    if (!values.startDate) return;
    onCreate({
      startDate: values.startDate,
      displayName: values.displayName.trim() || user.name,
      customAvatarUrl: values.customAvatarUrl.trim() || null,
      anniversaries: values.anniversaries,
    });
  };

  const pickAvatar = async () => {
    setImageError("");
    try {
      const image = await pickImagePath();
      if (image) setValue("customAvatarUrl", image, { shouldDirty: true });
    } catch (error) {
      console.error(error);
      setImageError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  return (
    <Page className="app-setup-page">
      <StatusBar />

      <section className="app-setup-hero">
        <div className="app-opening-pill">
          <Icon icon="zi-heart" />
          <span>Thiết lập</span>
        </div>
        <Text.Title size="large">Câu chuyện của hai bạn bắt đầu từ đây</Text.Title>
        <Text className="app-opening-copy">
          Xác nhận thông tin của bạn, ngày bắt đầu và vài kỷ niệm đầu tiên.
        </Text>
        <span className="app-setup-spark">✣</span>
      </section>

      <section className="app-setup-card">
        <div className="app-setup-user">
          <button
            type="button"
            className="app-setup-avatar app-setup-avatar-button"
            aria-label="Chọn ảnh đại diện"
            onClick={pickAvatar}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" />
            ) : (
              <Icon icon="zi-user" />
            )}
            <span className="app-avatar-camera">
              <Icon icon="zi-camera" />
            </span>
          </button>
          <div className="app-setup-user-copy">
            <div className="app-setup-name-row">
              {editingName ? (
                <AppTextInput
                  control={control}
                  name="displayName"
                  label="Tên của bạn"
                  autoFocus
                  onBlur={() => setEditingName(false)}
                />
              ) : (
                <>
                  <Text className="app-opening-card-title">
                    {displayName.trim() || user.name}
                  </Text>
                  <button
                    type="button"
                    className="app-name-edit-button"
                    aria-label="Sửa tên"
                    onClick={() => setEditingName(true)}
                  >
                    <Icon icon="zi-edit" />
                  </button>
                </>
              )}
            </div>
            <Text className="app-opening-card-copy">
              Lấy từ Zalo sau khi bạn cấp quyền, vẫn có thể chỉnh trước khi lưu.
            </Text>
            {imageError && <Text className="app-error-text">{imageError}</Text>}
          </div>
        </div>
      </section>

      <section className="app-setup-grid">
        <div className="app-setup-mini-card">
          <AppDatePicker
            control={control}
            name="startDate"
            label="Ngày bắt đầu"
            required
          />
        </div>
        <div className="app-setup-mini-card">
          <Text className="app-mini-label">
            <Icon icon="zi-lock" /> Riêng tư
          </Text>
          <strong>Chỉ hai bạn</strong>
          <Text>Zalo mini app lưu trong không gian riêng.</Text>
        </div>
      </section>

      <section className="app-setup-card app-setup-memory">
        <div className="app-setup-section-head">
          <Text className="app-opening-card-title">Kỷ niệm đầu tiên</Text>
          <Icon icon="zi-calendar" />
        </div>
        <AnniversaryForm onAdd={(draft) => append(draft)} />
        <AnniversaryList anniversaries={fields} />
      </section>

      <div className="app-setup-action">
        {error && <Text className="app-error-text">{error}</Text>}
        <Button
          fullWidth
          disabled={!canStart}
          loading={loading}
          onClick={handleSubmit(submit)}
        >
          Bắt đầu đếm ngày
        </Button>
        <Text className="app-opening-note">Bạn có thể chỉnh lại mọi thứ sau ở hồ sơ.</Text>
      </div>
      <BlockingLoadingOverlay
        show={Boolean(loading)}
        message="Đang lưu thông tin và ảnh của hai bạn..."
      />
    </Page>
  );
}
