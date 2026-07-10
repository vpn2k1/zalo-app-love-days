import { AppStatusBar } from "@/components/AppStatusBar";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import { useEffect } from "react";
import { AnniversariesPageHeader } from "./items/AnniversariesPageHeader";
import { AnniversariesPageList } from "./items/AnniversariesPageList";
import { useAnniversariesPage } from "./modules/useAnniversariesPage";

export function AnniversariesPage() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData(coupleData?.couple.id ?? '');

  if (!user) return null;

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <AnniversariesLoadingState />;
  }

  if (!coupleData) {
    return <AnniversariesMissingCoupleState />;
  }

  return (
    <AnniversariesPageContent anniversaries={anniversariesQuery.data ?? []} />
  );
}

function AnniversariesPageContent({
  anniversaries,
}: {
  anniversaries: Anniversary[];
}) {
  const page = useAnniversariesPage({ anniversaries });
  const navigation = useAppNavigation();

  return (
    <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[34px] pt-4 text-[#3c2435]">
      <AppStatusBar />
      <AnniversariesPageHeader
        filter={page.filter}
        filteredCount={page.filteredCount}
        query={page.query}
        setFilter={page.setFilter}
        setQuery={page.setQuery}
        totalCount={page.totalCount}
        onBack={navigation.goBack}
      />
      <AnniversariesPageList
        canLoadMore={page.canLoadMore}
        items={page.items}
        onLoadMore={page.loadMore}
        onOpenMemory={navigation.goMemory}
      />
    </Page>
  );
}

function AnniversariesLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}

function AnniversariesMissingCoupleState() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.goSetup({ replace: true });
  }, [navigation]);

  return <AnniversariesLoadingState />;
}
