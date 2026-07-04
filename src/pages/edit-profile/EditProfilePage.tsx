import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { AppSpinner, Page, useAppSnackbar } from "@/components/zaui";
import { useHomeViewState, setHomeViewState } from "@/hooks/useHomeViewState";
import { useLoveDaysData } from "@/hooks/useLoveDaysData";
import { pickImagePath } from "@/utils/imagePicker";
import { StatusBar } from "@/pages/home/items/StatusBar";
import { EditProfileActions } from "./items/EditProfileActions";
import { EditProfileDangerZone } from "./items/EditProfileDangerZone";
import { EditProfileFields } from "./items/EditProfileFields";
import { EditProfileHeader } from "./items/EditProfileHeader";
import { EditProfileLeaveModal } from "./items/EditProfileLeaveModal";
import { EditProfilePhoto } from "./items/EditProfilePhoto";
import { useProfilePageController } from "./modules/useProfilePageController";
import type {
  EditProfilePageProps,
  ProfileFormValues,
} from "./types/EditProfilePageType";
import "../../css/app.css";

export function EditProfilePage({ user }: EditProfilePageProps) {
  const queryClient = useQueryClient();
  const { coupleData, coupleQuery } = useLoveDaysData({ user });
  const profile = useProfilePageController({
    coupleData,
    queryClient,
    user,
  });
  const snackbar = useAppSnackbar();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const { control, handleSubmit, setValue, watch } = useForm<ProfileFormValues>({
    defaultValues: {
      display_name: user.display_name || user.name,
      custom_avatar_url: user.custom_avatar_url || user.avatar_url || "",
    },
  });
  const avatarUrl = watch("custom_avatar_url");
  const avatarSrc = getAvatarSrc(avatarUrl);

  const submit = async (values: ProfileFormValues) => {
    try {
      await profile.saveProfileMutation.mutateAsync({
        display_name: values.display_name.trim(),
        custom_avatar_url: values.custom_avatar_url.trim() || null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const pickAvatar = async () => {
    try {
      const image = await pickImagePath();
      if (image) setValue("custom_avatar_url", image, { shouldDirty: true });
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  if (coupleQuery.isFetching) return <EditProfileLoadingState />;
  if (!coupleData) return <EditProfileMissingCoupleState />;

  return (
    <Page className="app-setup-page">
      <form onSubmit={handleSubmit(submit)}>
        <StatusBar />
        <EditProfileHeader />
        <EditProfilePhoto
          avatarSrc={avatarSrc}
          onPickAvatar={pickAvatar}
        />
        <EditProfileFields control={control} />
        <EditProfileDangerZone
          disabled={profile.saveProfileMutation.isPending}
          onOpenConfirm={() => setConfirmLeave(true)}
        />
        <EditProfileActions
          loading={profile.saveProfileMutation.isPending}
          onBack={() => setHomeViewState("home")}
        />
      </form>

      <EditProfileLeaveModal
        visible={confirmLeave}
        leaveLoading={profile.leaveCoupleMutation.isPending}
        onClose={() => setConfirmLeave(false)}
        onLeave={() => profile.leaveCoupleMutation.mutateAsync()}
      />
    </Page>
  );
}

function EditProfileLoadingState() {
  return (
    <div className="boot-screen">
      <AppSpinner />
    </div>
  );
}

function EditProfileMissingCoupleState() {
  const state = useHomeViewState();

  useEffect(() => {
    if (state !== "edit") return;
    setHomeViewState("setup");
  }, [state]);

  return <EditProfileLoadingState />;
}

function getAvatarSrc(avatarUrl: string) {
  if (!avatarUrl) return undefined;

  return avatarUrl;
}
