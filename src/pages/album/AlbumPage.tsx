import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";

import { AppStatusBar } from "@/components/AppStatusBar";
import { AppPullToRefresh } from "@/components/AppPullToRefresh";
import { QuickMemoryCaptureModal } from "@/components/QuickMemoryCaptureModal";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";

import { AlbumPageGrid } from "./items/AlbumPageGrid";
import { AlbumPageHeader } from "./items/AlbumPageHeader";
import { useAlbumPage } from "./modules/useAlbumPage";
import { useFormValuesAlbum } from "./modules/useFormValuesAlbum";

const albumPageId = "album-page";

export function AlbumPage() {
  const album = useFormValuesAlbum();

  if (album.loading) return <AlbumLoadingState />;
  if (!album.coupleData) return <AlbumMissingCoupleState />;

  return (
    <FormProvider {...album.forms}>
      <AlbumPageContent
        anniversariesQuery={album.anniversariesQuery}
      />
    </FormProvider>
  );
}

function AlbumPageContent({
  anniversariesQuery,
}: {
  anniversariesQuery: ReturnType<typeof useFormValuesAlbum>["anniversariesQuery"];
}) {
  const navigation = useAppNavigation();
  const [quickCaptureVisible, setQuickCaptureVisible] = useState(false);
  const page = useAlbumPage();
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
  const openQuickCapture = () => {
    setQuickCaptureVisible(true);
  };
  const closeQuickCapture = () => {
    setQuickCaptureVisible(false);
  };
  const createQuickMemory = (imageUrl: string) => {
    navigation.goCreateMemory(imageUrl);
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
        totalCount={page.totalCount}
        onBack={navigation.goBack}
        onQuickAdd={openQuickCapture}
      />
      <AlbumPageGrid
        canLoadMore={canLoadMore}
        items={page.items}
        onLoadMore={loadMore}
      />
      <QuickMemoryCaptureModal
        visible={quickCaptureVisible}
        onClose={closeQuickCapture}
        onSelectImage={createQuickMemory}
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
