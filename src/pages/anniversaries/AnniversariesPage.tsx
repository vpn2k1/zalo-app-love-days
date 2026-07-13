import { AppStatusBar } from "@/components/AppStatusBar";
import { AppPullToRefresh } from "@/components/AppPullToRefresh";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useInfiniteAnniversariesData } from "@/hooks/useInfiniteAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import { useEffect } from "react";
import { AnniversariesPageHeader } from "./items/AnniversariesPageHeader";
import { AnniversariesPageList } from "./items/AnniversariesPageList";
import { useAnniversariesPage } from "./modules/useAnniversariesPage";

const anniversariesPageId = "anniversaries-page";

export function AnniversariesPage() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversaries, anniversariesQuery } = useInfiniteAnniversariesData(
    coupleData?.couple.id ?? "",
  );

  if (!user) return null;

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <AnniversariesLoadingState />;
  }

  if (!coupleData) {
    return <AnniversariesMissingCoupleState />;
  }

  return (
    <AnniversariesPageContent
      anniversaries={anniversaries}
      anniversariesQuery={anniversariesQuery}
    />
  );
}

function AnniversariesPageContent({
  anniversaries,
  anniversariesQuery,
}: {
  anniversaries: Anniversary[];
  anniversariesQuery: ReturnType<typeof useInfiniteAnniversariesData>["anniversariesQuery"];
}) {
  const page = useAnniversariesPage({ anniversaries });
  const navigation = useAppNavigation();
  const canLoadMore = page.canLoadMore || Boolean(anniversariesQuery.hasNextPage);
  const loadMore = () => {
    if (page.canLoadMore) {
      page.loadMore();
      return;
    }
    if (!anniversariesQuery.hasNextPage) return;
    if (anniversariesQuery.isFetchingNextPage) return;

    void anniversariesQuery.fetchNextPage();
  };

  return (
    <Page
      id={anniversariesPageId}
      className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[34px] pt-4 text-[#3c2435]"
    >
      <AppPullToRefresh
        pageId={anniversariesPageId}
        refreshing={anniversariesQuery.isRefetching}
        onRefresh={anniversariesQuery.refetch}
      />
      <AppStatusBar />
      <AnniversariesPageHeader
        filter={page.filter}
        filteredCount={page.filteredCount}
        query={page.query}
        setFilter={page.setFilter}
        setQuery={page.setQuery}
        totalCount={page.totalCount}
        onBack={navigation.goBack}
        onCreateMemory={navigation.goCreateMemory}
      />
      <AnniversariesPageList
        canLoadMore={canLoadMore}
        items={page.items}
        onLoadMore={loadMore}
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
