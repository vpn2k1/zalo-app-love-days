import { AppStatusBar } from "@/components/AppStatusBar";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useLeaveCoupleMutation } from "@/hooks/mutations/useLeaveCoupleMutation";
import { useSaveProfileMutation } from "@/hooks/mutations/useSaveProfileMutation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "../../css/app.css";
import { EditProfileActions } from "./items/EditProfileActions";
import { EditProfileDangerZone } from "./items/EditProfileDangerZone";
import { EditProfileFields } from "./items/EditProfileFields";
import { EditProfileHeader } from "./items/EditProfileHeader";
import { EditProfileLeaveModal } from "./items/EditProfileLeaveModal";
import { EditProfilePhoto } from "./items/EditProfilePhoto";
import type { ProfileFormValues } from "./types/EditProfilePageType";

export function EditProfilePage() {
  const { user } = useCurrentUser();
  const navigation = useAppNavigation();
  const { coupleData, coupleQuery } = useCoupleData();
  const saveProfile = useSaveProfileMutation();
  const leaveCouple = useLeaveCoupleMutation();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const methods = useForm<ProfileFormValues>({
    defaultValues: {
      display_name: user?.display_name || user?.name || "",
      custom_avatar_url: user?.custom_avatar_url || user?.avatar_url || "",
    },
  });

  const submit = async (values: ProfileFormValues) => {
    try {
      await saveProfile.mutateAsync({
        display_name: values.display_name.trim(),
        custom_avatar_url: values.custom_avatar_url.trim() || null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;
  if (coupleQuery.isPending) return <EditProfileLoadingState />;
  if (!coupleData) return <EditProfileMissingCoupleState />;

  return (
    <FormProvider {...methods}>
      <Page className="app-setup-page">
        <AppStatusBar />
        <EditProfileHeader />
        <EditProfilePhoto />
        <EditProfileFields />
        <EditProfileDangerZone
          disabled={saveProfile.isPending}
          onOpenConfirm={() => setConfirmLeave(true)}
        />
        <EditProfileActions
          loading={saveProfile.isPending}
          onBack={navigation.goHome}
          onSave={methods.handleSubmit(submit)}
        />

        <EditProfileLeaveModal
          visible={confirmLeave}
          leaveLoading={leaveCouple.isPending}
          onClose={() => setConfirmLeave(false)}
          onLeave={() => leaveCouple.mutateAsync()}
        />
        <BlockingLoadingOverlay
          show={saveProfile.isPending || leaveCouple.isPending}
          message={leaveCouple.isPending ? "Đang rời không gian..." : "Đang lưu thay đổi..."}
        />
      </Page>
    </FormProvider>
  );
}

function EditProfileLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}

function EditProfileMissingCoupleState() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.goSetup({ replace: true });
  }, [navigation]);

  return <EditProfileLoadingState />;
}
