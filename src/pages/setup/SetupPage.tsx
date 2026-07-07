import { FormProvider, useForm } from "react-hook-form";
import { Page } from "zmp-ui";
import type { AppUser } from "@/types/user";
import { StatusBar } from "@/pages/home/items/StatusBar";
import { SetupPageHeader } from "./items/SetupPageHeader";
import { SetupPageAvatarPicker } from "./items/SetupPageAvatarPicker";
import { SetupPageBackgroundPicker } from "./items/SetupPageBackgroundPicker";
import { SetupPageDatePicker } from "./items/SetupPageDatePicker";
import { SetupPageMemories } from "./items/SetupPageMemories";
import { SetupPageButton } from "./items/SetupPageButton";
import { useSetupPageController } from "./modules/useSetupPageController";
import type { SetupFormValues } from "./types/SetupPageType";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { SetupMemorySheet } from "./items/SetupMemorySheet";

type Props = {
  user: AppUser;
};

export function SetupPage({ user }: Props) {
  const setup = useSetupPageController({ user });
  const methods = useForm<SetupFormValues>({
    defaultValues: {
      startDate: "",
      backgroundUrl: "",
      displayName: user.display_name || user.name,
      customAvatarUrl: user.custom_avatar_url || user.avatar_url || "",
      anniversaries: [],
    },
  });
  return (
    <FormProvider {...methods}>
      <Page className="app-setup-page">
        {/* <StatusBar /> */}
        <SetupPageHeader />
        <SetupPageBackgroundPicker />
        <SetupPageAvatarPicker user={user} />
        <SetupPageDatePicker />
        <SetupMemorySheet />
        <SetupPageButton
          loading={setup.createCoupleMutation.isPending}
          onCreate={async (input) => {
            await setup.createCoupleMutation.mutateAsync(input);
          }}
          user={user}
        />
        <BlockingLoadingOverlay
          show={setup.createCoupleMutation.isPending}
          message="Đang lưu thông tin và ảnh của hai bạn..."
        />
      </Page>
    </FormProvider>
  );
}
