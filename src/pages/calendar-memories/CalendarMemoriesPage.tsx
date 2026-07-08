import { AppStatusBar } from "@/components/AppStatusBar";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import { useEffect } from "react";
import { CalendarMemoriesGrid } from "./items/CalendarMemoriesGrid";
import { CalendarMemoriesHeader } from "./items/CalendarMemoriesHeader";

export function CalendarMemoriesPage() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData();

  if (!user) return null;

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <CalendarMemoriesLoadingState />;
  }

  if (!coupleData) return <CalendarMemoriesMissingCoupleState />;

  return (
    <CalendarMemoriesContent anniversaries={anniversariesQuery.data ?? []} />
  );
}

function CalendarMemoriesContent({
  anniversaries,
}: {
  anniversaries: Anniversary[];
}) {
  const navigation = useAppNavigation();

  return (
    <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[calc(34px+env(safe-area-inset-bottom))] pt-4 text-[#3c2435] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <AppStatusBar />
      <CalendarMemoriesHeader
        totalCount={anniversaries.length}
        onBack={navigation.goHome}
      />
      <CalendarMemoriesGrid
        anniversaries={anniversaries}
        onOpenMemory={navigation.goMemory}
      />
    </Page>
  );
}

function CalendarMemoriesLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}

function CalendarMemoriesMissingCoupleState() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.goSetup({ replace: true });
  }, [navigation]);

  return <CalendarMemoriesLoadingState />;
}
