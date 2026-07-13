import { useEffect } from "react";

import { AppStatusBar } from "@/components/AppStatusBar";
import { AppPullToRefresh } from "@/components/AppPullToRefresh";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useInfiniteAnniversariesData } from "@/hooks/useInfiniteAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import { AlbumPageGrid } from "./items/AlbumPageGrid";
import { AlbumPageHeader } from "./items/AlbumPageHeader";
import { useAlbumPage } from "./modules/useAlbumPage";

const albumPageId = "album-page";

export function AlbumPage() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversaries, anniversariesQuery } = useInfiniteAnniversariesData(
    coupleData?.couple.id ?? "",
  );

  if (!user) return null;

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <AlbumLoadingState />;
  }

  if (!coupleData) return <AlbumMissingCoupleState />;

  return (
    <AlbumPageContent
      anniversaries={anniversaries}
      anniversariesQuery={anniversariesQuery}
    />
  );
}

function AlbumPageContent({
  anniversaries,
  anniversariesQuery,
}: {
  anniversaries: Anniversary[];
  anniversariesQuery: ReturnType<typeof useInfiniteAnniversariesData>["anniversariesQuery"];
}) {
  const navigation = useAppNavigation();
  const page = useAlbumPage({ anniversaries });
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
      id={albumPageId}
      className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[calc(34px+env(safe-area-inset-bottom))] pt-4 text-[#3c2435] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <AppPullToRefresh
        pageId={albumPageId}
        refreshing={anniversariesQuery.isRefetching}
        onRefresh={anniversariesQuery.refetch}
      />
      <AppStatusBar />
      <AlbumPageHeader
        filteredCount={page.filteredCount}
        filters={page.filters}
        setFilters={page.setFilters}
        setSortOrder={page.setSortOrder}
        sortOrder={page.sortOrder}
        totalCount={page.totalCount}
        onBack={navigation.goBack}
      />
      <AlbumPageGrid
        canLoadMore={canLoadMore}
        items={page.items}
        onLoadMore={loadMore}
        onOpenMemory={navigation.goMemory}
      />
    </Page>
  );
}

function AlbumLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}

function AlbumMissingCoupleState() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.goSetup({ replace: true });
  }, [navigation]);

  return <AlbumLoadingState />;
}
