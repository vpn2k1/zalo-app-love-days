import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppSpinner, Box } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useLeaveCoupleMutation } from "@/hooks/mutations/useLeaveCoupleMutation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { HomePageBody } from "./items/HomePageBody";
import { useHomeDisplayForm } from "./modules/useHomeDisplayForm";
import { useAnniversaryMutation } from "./modules/useAnniversaryMutation";
import { useInvitePartnerMutation } from "./modules/useInvitePartnerMutation";
import { useUpdateBackgroundMutation } from "@/hooks/mutations/useUpdateBackgroundMutation";
import { HomePageProvider } from "./modules/useHomePageContext";
import type { HomePageContentProps } from "./types/HomePageType";

export function HomePage() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData(
    coupleData?.couple?.id ?? "",
  );
  const addAnniversaryMutation = useAnniversaryMutation();
  const invitePartnerMutation = useInvitePartnerMutation();
  const leaveCouple = useLeaveCoupleMutation();
  const updateBackgroundMutation = useUpdateBackgroundMutation();
  const navigation = useAppNavigation();

  if (isInitialHomeLoading({ anniversariesQuery, coupleData, coupleQuery })) {
    return <HomeLoadingState />;
  }

  if (!user) return <HomeLoadingState />;
  if (!coupleData) return <HomeMissingCoupleState />;

  return (
    <HomePageContent
      user={user}
      coupleData={coupleData}
      anniversaries={anniversariesQuery.data ?? []}
      addPartnerLoading={invitePartnerMutation.isPending}
      blockingMessage={getBlockingMessage(
        addAnniversaryMutation.isPending,
        invitePartnerMutation.isPending,
        leaveCouple.isPending,
        updateBackgroundMutation.isPending,
      )}
      addAnniversaryLoading={addAnniversaryMutation.isPending}
      onAddPartner={() => invitePartnerMutation.mutateAsync()}
      onAddAnniversary={(draft) => addAnniversaryMutation.mutateAsync(draft)}
      onEditProfile={navigation.goEdit}
      onUpdateBackground={async (url) => {
        await updateBackgroundMutation.mutateAsync(url);
      }}
    />
  );
}

function HomePageContent(props: HomePageContentProps) {
  const { coupleData, anniversaries, user } = props;
  const methods = useHomeDisplayForm({
    anniversaries,
    coupleData,
    user,
  });
  return (
    <HomePageProvider value={props}>
      <FormProvider {...methods}>
        <BlockingLoadingOverlay
          show={!!props.blockingMessage}
          message={props.blockingMessage || "Đang lưu thay đổi..."}
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
    navigation.goSetup({ replace: true });
  }, [navigation]);

  return <HomeLoadingState />;
}

type HomeQueries = {
  anniversariesQuery: ReturnType<
    typeof useAnniversariesData
  >["anniversariesQuery"];
  coupleData: ReturnType<typeof useCoupleData>["coupleData"];
  coupleQuery: ReturnType<typeof useCoupleData>["coupleQuery"];
};

function isInitialHomeLoading({
  anniversariesQuery,
  coupleData,
  coupleQuery,
}: HomeQueries) {
  if (coupleQuery.isPending) return true;
  if (coupleData && anniversariesQuery.isPending) return true;

  return false;
}

function getBlockingMessage(
  isAddingAnniversary: boolean,
  isInvitingPartner: boolean,
  isLeavingCouple: boolean,
  isUpdatingBackground: boolean,
): string | null {
  if (isAddingAnniversary) return "Đang lưu ngày kỷ niệm...";
  if (isInvitingPartner) return "Đang mời người ấy...";
  if (isLeavingCouple) return "Đang rời không gian...";
  if (isUpdatingBackground) return "Đang cập nhật ảnh nền...";

  return null;
}
