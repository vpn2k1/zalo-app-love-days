import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useHomeViewState, setHomeViewState } from "@/hooks/useHomeViewState";
import { useLoveDaysData } from "@/hooks/useLoveDaysData";
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
  const [confirmLeave, setConfirmLeave] = useState(false);
  const methods = useForm<ProfileFormValues>({
    defaultValues: {
      display_name: user.display_name || user.name,
      custom_avatar_url: user.custom_avatar_url || user.avatar_url || "",
    },
  });

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

  if (coupleQuery.isFetching) return <EditProfileLoadingState />;
  if (!coupleData) return <EditProfileMissingCoupleState />;

  return (
    <FormProvider {...methods}>
      <Page className="app-setup-page">
        <StatusBar />
        <EditProfileHeader />
        <EditProfilePhoto />
        <EditProfileFields />
        <EditProfileDangerZone
          disabled={profile.saveProfileMutation.isPending}
          onOpenConfirm={() => setConfirmLeave(true)}
        />
        <EditProfileActions
          loading={profile.saveProfileMutation.isPending}
          onBack={() => setHomeViewState("home")}
          onSave={methods.handleSubmit(submit)}
        />

        <EditProfileLeaveModal
          visible={confirmLeave}
          leaveLoading={profile.leaveCoupleMutation.isPending}
          onClose={() => setConfirmLeave(false)}
          onLeave={() => profile.leaveCoupleMutation.mutateAsync()}
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
  const state = useHomeViewState();

  useEffect(() => {
    if (state !== "edit") return;
    setHomeViewState("permission");
  }, [state]);

  return <EditProfileLoadingState />;
}
