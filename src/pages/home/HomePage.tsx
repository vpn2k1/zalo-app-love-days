import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useHomeViewState, setHomeViewState } from "@/hooks/useHomeViewState";
import { useLoveDaysData } from "@/hooks/useLoveDaysData";
import { useProfileMutations } from "@/hooks/useProfileMutations";
import { isMockMode } from "@/services/supabaseClient";
import { formatDate } from "@/utils/date";
import { AnniversaryComposer } from "./items/AnniversaryComposer";
import { CouplePeoplePanel } from "./items/CouplePeoplePanel";
import { DaysTogetherButton } from "./items/DaysTogetherButton";
import { FeedbackPanel } from "./items/FeedbackPanel";
import { HomeHeader } from "./items/HomeHeader";
import { HomeHero } from "./items/HomeHero";
import { MemoryChips } from "./items/MemoryChips";
import { MemoryGardenSection } from "./items/MemoryGardenSection";
import { QuickActionGrid } from "./items/QuickActionGrid";
import { StatusBar } from "./items/StatusBar";
import { StartDateModal } from "./items/StartDateModal";
import { TimelineSection } from "./items/TimelineSection";
import { useHomePageController } from "./modules/useHomePageController";
import { useHomePage } from "./modules/useHomePage";
import type { HomePageContentProps, HomePageProps } from "./types/HomePageType";

export function HomePage({ user }: HomePageProps) {
  const queryClient = useQueryClient();
  const { anniversariesQuery, coupleData, coupleQuery } = useLoveDaysData({
    user,
  });
  const homeController = useHomePageController({ coupleData, user });
  const profile = useProfileMutations({
    coupleData,
    queryClient,
    user,
  });

  if (coupleQuery.isFetching || anniversariesQuery.isFetching) {
    return <HomeLoadingState />;
  }

  if (!coupleData) return <HomeMissingCoupleState />;

  return (
    <HomePageContent
      user={user}
      coupleData={coupleData}
      anniversaries={anniversariesQuery.data ?? []}
      addPartnerLoading={homeController.invitePartnerMutation.isPending}
      profileLoading={getProfileLoading(profile)}
      addAnniversaryLoading={homeController.addAnniversaryMutation.isPending}
      onAddPartner={() => homeController.invitePartnerMutation.mutateAsync()}
      onSaveProfile={(payload) =>
        profile.saveProfileMutation.mutateAsync(payload)
      }
      onUpdateStartDate={(startDate) =>
        profile.updateStartDateMutation.mutateAsync(startDate)
      }
      onAddAnniversary={(draft) =>
        homeController.addAnniversaryMutation.mutateAsync(draft)
      }
      onEditProfile={() => setHomeViewState("edit")}
    />
  );
}

function HomePageContent(props: HomePageContentProps) {
  const {
    coupleData,
    anniversaries,
    addPartnerLoading,
    profileLoading,
    addAnniversaryLoading,
    onAddPartner,
    onEditProfile,
    onUpdateStartDate,
  } = props;
  const home = useHomePage(props);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openDatePicker = () => setShowDatePicker(true);
  const closeDatePicker = () => setShowDatePicker(false);
  const toggleAnniversaryForm = () => {
    home.setShowAnniversaryForm((value) => !value);
  };

  return (
    <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[34px] pt-4 text-[#3c2435]">
      <StatusBar />
      <HomeHeader
        title="Our little universe"
        subtitle={`Friday, ${formatDate(coupleData.couple.start_date)}`}
        onEditProfile={onEditProfile}
      />
      <HomeHero backgroundUrl={coupleData.couple.background_url} />
      <CouplePeoplePanel
        currentPerson={home.currentPerson}
        partnerPerson={home.partnerPerson}
        onAddPartner={onAddPartner}
      />
      <DaysTogetherButton startDate={coupleData.couple.start_date} />
      <StartDateModal
        currentStartDate={coupleData.couple.start_date}
        loading={profileLoading}
        visible={showDatePicker}
        onClose={closeDatePicker}
        onSave={onUpdateStartDate}
      />
      {/* <QuickActionGrid
        onEditProfile={onEditProfile}
        onAddPartner={onAddPartner}
        onAddAnniversary={toggleAnniversaryForm}
        addPartnerLoading={addPartnerLoading}
      />
      <AnniversaryComposer
        loading={addAnniversaryLoading}
        visible={home.showAnniversaryForm}
        onAdd={home.addAnniversary}
      />
      <MemoryGardenSection
        anniversaries={anniversaries}
        nextAnniversary={home.nextAnniversary}
        onShowAnniversaryForm={() => home.setShowAnniversaryForm(true)}
      />
      <TimelineSection anniversaries={home.visibleAnniversaries} />
      <MemoryChips />
      <FeedbackPanel
        mockMode={isMockMode}
        addPartnerLoading={addPartnerLoading}
        profileLoading={profileLoading}
      /> */}
    </Page>
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
  const state = useHomeViewState();

  useEffect(() => {
    if (state !== "home") return;
    setHomeViewState("permission");
  }, [state]);

  return <HomeLoadingState />;
}

function getProfileLoading(profile: ReturnType<typeof useProfileMutations>) {
  if (profile.saveProfileMutation.isPending) return true;
  if (profile.updateStartDateMutation.isPending) return true;

  return false;
}
