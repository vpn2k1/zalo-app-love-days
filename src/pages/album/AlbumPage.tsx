import { useEffect } from "react";

import { AppStatusBar } from "@/components/AppStatusBar";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import { AlbumPageGrid } from "./items/AlbumPageGrid";
import { AlbumPageHeader } from "./items/AlbumPageHeader";
import { useAlbumPage } from "./modules/useAlbumPage";

export function AlbumPage() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData();

  if (!user) return null;

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <AlbumLoadingState />;
  }

  if (!coupleData) return <AlbumMissingCoupleState />;

  return (
    <AlbumPageContent
      anniversaries={anniversariesQuery.data ?? []}
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
      <AppStatusBar />
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
        onOpenMemory={navigation.goMemory}
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
    navigation.goSetup({ replace: true });
  }, [navigation]);

  return <AlbumLoadingState />;
}
