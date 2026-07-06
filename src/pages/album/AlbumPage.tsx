import { useEffect } from "react";

import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useLoveDaysData } from "@/hooks/useLoveDaysData";
import { StatusBar } from "@/pages/home/items/StatusBar";
import type { Anniversary } from "@/types/anniversary";
import { AlbumPageGrid } from "./items/AlbumPageGrid";
import { AlbumPageHeader } from "./items/AlbumPageHeader";
import { useAlbumPage } from "./modules/useAlbumPage";
import type { AlbumPageProps } from "./types/AlbumPageType";

export function AlbumPage({ user }: AlbumPageProps) {
  const { anniversariesQuery, coupleData, coupleQuery } = useLoveDaysData({
    user,
  });

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <AlbumLoadingState />;
  }

  if (!coupleData) return <AlbumMissingCoupleState />;

  return (
    <AlbumPageContent
      anniversaries={getAnniversaries(anniversariesQuery.data)}
      onRefresh={anniversariesQuery.refetch}
    />
  );
}

function AlbumPageContent({
  anniversaries,
  onRefresh,
}: {
  anniversaries: Anniversary[];
  onRefresh: () => Promise<unknown>;
}) {
  const navigation = useAppNavigation();
  const page = useAlbumPage({ anniversaries, onRefresh });

  return (
    <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[calc(34px+env(safe-area-inset-bottom))] pt-4 text-[#3c2435] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <StatusBar />
      <AlbumPageHeader
        filteredCount={page.filteredCount}
        filters={page.filters}
        setFilters={page.setFilters}
        setSortOrder={page.setSortOrder}
        sortOrder={page.sortOrder}
        totalCount={page.totalCount}
        onBack={navigation.goHome}
      />
      <AlbumPageGrid
        canLoadMore={page.canLoadMore}
        isRefreshing={page.isRefreshing}
        items={page.items}
        onLoadMore={page.loadMore}
        onRefresh={page.refresh}
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
    navigation.goHome({ replace: true });
  }, [navigation]);

  return <AlbumLoadingState />;
}

function getAnniversaries(anniversaries?: Anniversary[]) {
  if (!anniversaries) return [];

  return anniversaries;
}
