import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider } from "react-hook-form";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppSpinner, Box } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useLoveDaysData } from "@/hooks/useLoveDaysData";
import { useProfileMutations } from "@/hooks/useProfileMutations";
import { HomePageBody } from "./items/HomePageBody";
import { useHomeDisplayForm } from "./modules/useHomeDisplayForm";
import { useHomePageController } from "./modules/useHomePageController";
import { HomePageProvider } from "./modules/useHomePageContext";
import type { HomePageContentProps, HomePageProps } from "./types/HomePageType";

export function HomePage({ user }: HomePageProps) {
  const queryClient = useQueryClient();
  const navigation = useAppNavigation();
  const { anniversariesQuery, coupleData, coupleQuery } = useLoveDaysData({
    user,
  });
  const homeController = useHomePageController({ coupleData, user });
  const profile = useProfileMutations({
    coupleData,
    queryClient,
    user,
  });

  if (isInitialHomeLoading({ anniversariesQuery, coupleData, coupleQuery })) {
    return <HomeLoadingState />;
  }

  if (!coupleData) return <HomeMissingCoupleState />;

  return (
    <HomePageContent
      user={user}
      coupleData={coupleData}
      anniversaries={anniversariesQuery.data ?? []}
      addPartnerLoading={homeController.invitePartnerMutation.isPending}
      blockingLoading={getBlockingLoading(homeController, profile)}
      profileLoading={getProfileLoading(profile)}
      addAnniversaryLoading={homeController.addAnniversaryMutation.isPending}
      onAddPartner={() => homeController.invitePartnerMutation.mutateAsync()}
      onUpdateBackground={(backgroundUrl) =>
        profile.updateBackgroundMutation.mutateAsync(backgroundUrl)
      }
      onUpdateProfile={(payload) =>
        profile.saveProfileMutation.mutateAsync(payload)
      }
      onUpdateStartDate={(startDate) =>
        profile.updateStartDateMutation.mutateAsync(startDate)
      }
      onAddAnniversary={(draft) =>
        homeController.addAnniversaryMutation.mutateAsync(draft)
      }
      onEditProfile={navigation.goEdit}
    />
  );
}

function HomePageContent(props: HomePageContentProps) {
  const {
    coupleData,
    anniversaries,
  } = props;
  const methods = useHomeDisplayForm({
    anniversaries,
    coupleData,
    user: props.user,
  });
  return (
    <HomePageProvider value={props}>
      <FormProvider {...methods}>
        <BlockingLoadingOverlay
          show={props.blockingLoading}
          message="Đang lưu thay đổi..."
        />
        <HomePageBody />
      </FormProvider>
    </HomePageProvider>
  );
}

function HomeLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}

function HomeMissingCoupleState() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.goPermission({ replace: true });
  }, [navigation]);

  return <HomeLoadingState />;
}

function getProfileLoading(profile: ReturnType<typeof useProfileMutations>) {
  if (profile.saveProfileMutation.isPending) return true;
  if (profile.updateBackgroundMutation.isPending) return true;
  if (profile.updateStartDateMutation.isPending) return true;

  return false;
}

type HomeQueries = Pick<
  ReturnType<typeof useLoveDaysData>,
  "anniversariesQuery" | "coupleData" | "coupleQuery"
>;

function isInitialHomeLoading({
  anniversariesQuery,
  coupleData,
  coupleQuery,
}: HomeQueries) {
  if (coupleQuery.isPending) return true;
  if (coupleData && anniversariesQuery.isPending) return true;

  return false;
}

function getBlockingLoading(
  homeController: ReturnType<typeof useHomePageController>,
  profile: ReturnType<typeof useProfileMutations>,
) {
  if (homeController.addAnniversaryMutation.isPending) return true;
  if (homeController.invitePartnerMutation.isPending) return true;
  if (profile.leaveCoupleMutation.isPending) return true;
  if (getProfileLoading(profile)) return true;

  return false;
}
