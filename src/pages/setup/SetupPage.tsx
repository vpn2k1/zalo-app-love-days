import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Page } from "zmp-ui";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { StatusBar } from "@/pages/home/items/StatusBar";
import { SetupPageHeader } from "./items/SetupPageHeader";
import { SetupPageAvatarPicker } from "./items/SetupPageAvatarPicker";
import { SetupPageBackgroundPicker } from "./items/SetupPageBackgroundPicker";
import { SetupPageDatePicker } from "./items/SetupPageDatePicker";
import { SetupPageMemories } from "./items/SetupPageMemories";
import { SetupPageButton } from "./items/SetupPageButton";
import { useCreateCoupleMutation } from "./modules/useCreateCoupleMutation";
import type { SetupFormValues } from "./types/SetupPageType";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { SetupMemorySheet } from "./items/SetupMemorySheet";
import { AppStatusBar } from "@/components/AppStatusBar";

export function SetupPage() {
  const { user } = useCurrentUser();
  const { createCoupleMutation } = useCreateCoupleMutation({ user: user! }); // protected route ensures user
  const methods = useForm<SetupFormValues>({
    defaultValues: {
      startDate: "",
      backgroundUrl: "",
      displayName: user?.display_name || user?.name || "",
      customAvatarUrl: user?.custom_avatar_url || user?.avatar_url || "",
      anniversaries: [],
    },
  });

  if (!user) return null;

  return (
    <FormProvider {...methods}>
      <Page className="app-setup-page">
        <AppStatusBar />
        <SetupPageHeader />
        <SetupPageBackgroundPicker />
        <SetupPageAvatarPicker user={user!} />
        <SetupPageDatePicker />
        <SetupMemorySheet />
        <SetupPageButton
          loading={createCoupleMutation.isPending}
          onCreate={async (input) => {
            await createCoupleMutation.mutateAsync(input);
          }}
          user={user!}
        />
        <BlockingLoadingOverlay
          show={createCoupleMutation.isPending}
          message="Đang lưu thông tin và ảnh của hai bạn..."
        />
      </Page>
    </FormProvider>
  );
}
