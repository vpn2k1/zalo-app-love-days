import { useEffect } from "react";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useLoveDaysData } from "@/hooks/useLoveDaysData";
import { StatusBar } from "@/pages/home/items/StatusBar";
import type { Anniversary } from "@/types/anniversary";
import { AnniversariesPageHeader } from "./items/AnniversariesPageHeader";
import { AnniversariesPageList } from "./items/AnniversariesPageList";
import { useAnniversariesPage } from "./modules/useAnniversariesPage";
import type { AnniversariesPageProps } from "./types/AnniversariesPageType";

export function AnniversariesPage({ user }: AnniversariesPageProps) {
  const { anniversariesQuery, coupleData, coupleQuery } = useLoveDaysData({
    user,
  });

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <AnniversariesLoadingState />;
  }

  if (!coupleData) {
    return <AnniversariesMissingCoupleState />;
  }

  return (
    <AnniversariesPageContent
      anniversaries={getAnniversaries(anniversariesQuery.data)}
    />
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
      {/* <StatusBar /> */}
      <AnniversariesPageHeader
        filter={page.filter}
        filteredCount={page.filteredCount}
        query={page.query}
        setFilter={page.setFilter}
        setQuery={page.setQuery}
        totalCount={page.totalCount}
        onBack={navigation.goHome}
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
    navigation.goHome({ replace: true });
  }, [navigation]);

  return <AnniversariesLoadingState />;
}

function getAnniversaries(anniversaries?: Anniversary[]) {
  if (!anniversaries) return [];

  return anniversaries;
}
