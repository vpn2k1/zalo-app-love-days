import { useEffect } from "react";
import { FormProvider } from "react-hook-form";

import { AppPullToRefresh } from "@/components/AppPullToRefresh";
import { AppStatusBar } from "@/components/AppStatusBar";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";

import { AnniversariesPageHeader } from "./items/AnniversariesPageHeader";
import { AnniversariesPageList } from "./items/AnniversariesPageList";
import { useAnniversariesPage } from "./modules/useAnniversariesPage";
import { useFormValuesAnniversaries } from "./modules/useFormValuesAnniversaries";

const anniversariesPageId = "anniversaries-page";

export function AnniversariesPage() {
  const anniversaries = useFormValuesAnniversaries();

  if (anniversaries.loading) return <AnniversariesLoadingState />;
  if (!anniversaries.coupleData) return <AnniversariesMissingCoupleState />;

  return (
    <FormProvider {...anniversaries.forms}>
      <AnniversariesPageContent
        anniversariesQuery={anniversaries.anniversariesQuery}
      />
    </FormProvider>
  );
}

function AnniversariesPageContent({
  anniversariesQuery,
}: {
  anniversariesQuery: ReturnType<typeof useFormValuesAnniversaries>["anniversariesQuery"];
}) {
  const page = useAnniversariesPage();
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
        filteredCount={page.filteredCount}
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
