import { useState } from "react";

import { AppPullToRefresh } from "@/components/AppPullToRefresh";
import { Page } from "@/components/zaui";
import { formatDate } from "@/utils/date";
import { AnniversaryComposer } from "./AnniversaryComposer";
import { CouplePeoplePanel } from "./CouplePeoplePanel";
import { DaysTogetherButton } from "./DaysTogetherButton";
import { HomeHeader } from "./HomeHeader";
import { HomeHero } from "./HomeHero";
import { MemoryGardenSection } from "./MemoryGardenSection";
import { QuickActionGrid } from "./QuickActionGrid";
import { QuickMemoryCaptureModal } from "./QuickMemoryCaptureModal";
import { StatusBar } from "./StatusBar";
import { TimelineSection } from "./TimelineSection";
import { useHomePageView } from "../modules/useHomePageView";

const homePageId = "home-page";

export function HomePageBody() {
  const home = useHomePageView();
  const [quickCaptureVisible, setQuickCaptureVisible] = useState(false);

  const openQuickCapture = () => {
    setQuickCaptureVisible(true);
  };

  const closeQuickCapture = () => {
    setQuickCaptureVisible(false);
  };

  const createQuickMemory = (imageUrl: string) => {
    home.onQuickAddMemory(imageUrl);
  };

  return (
    <Page
      id={homePageId}
      className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[34px] pt-4 text-[#3c2435] [scrollbar-width:none]"
    >
      <AppPullToRefresh
        pageId={homePageId}
        refreshing={Boolean(home.refreshing)}
        onRefresh={home.onRefresh}
      />
      <StatusBar />
      <HomeHeader
        title="Góc nhỏ của chúng mình"
        subtitle={`Từ ngày ${formatDate(home.startDate)}`}
        onEditProfile={home.onEditProfile}
        avatar={home.currentPerson.avatar}
      />
      <HomeHero backgroundUrl={home.backgroundUrl} />
      <CouplePeoplePanel
        currentPerson={home.currentPerson}
        partnerPerson={home.partnerPerson}
        onAddPartner={home.onAddPartner}
        onEditProfile={home.onEditProfile}
      />
      <DaysTogetherButton />
      <QuickActionGrid
        onQuickAddMemory={openQuickCapture}
        onOpenCalendar={home.openCalendar}
        onViewAlbums={home.onViewAlbums}
        onViewMemories={home.onViewAllAnniversaries}
      />
      <QuickMemoryCaptureModal
        visible={quickCaptureVisible}
        onClose={closeQuickCapture}
        onSelectImage={createQuickMemory}
      />
      <AnniversaryComposer
        loading={home.addAnniversaryLoading}
        visible={home.showAnniversaryComposer}
        onAdd={home.addAnniversary}
        onClose={home.hideAnniversaryForm}
      />
      <MemoryGardenSection
        nextAnniversary={home.nextAnniversary}
        onShowAnniversaryForm={home.showAnniversaryForm}
      />
      <TimelineSection
        anniversaries={home.visibleAnniversaries}
        onViewAll={home.onViewAllAnniversaries}
      />
    </Page>
  );
}
