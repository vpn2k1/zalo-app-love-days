import { useEffect } from "react";
import { AppSpinner, Box, Page } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useLoveDaysData } from "@/hooks/useLoveDaysData";
import type { Anniversary } from "@/types/anniversary";
import type { AppUser } from "@/types/user";
import { CalendarMemoriesGrid } from "./items/CalendarMemoriesGrid";
import { CalendarMemoriesHeader } from "./items/CalendarMemoriesHeader";

type Props = {
  user: AppUser;
};

export function CalendarMemoriesPage({ user }: Props) {
  const { anniversariesQuery, coupleData, coupleQuery } = useLoveDaysData({
    user,
  });

  if (coupleQuery.isPending || (coupleData && anniversariesQuery.isPending)) {
    return <CalendarMemoriesLoadingState />;
  }

  if (!coupleData) return <CalendarMemoriesMissingCoupleState />;

  return (
    <CalendarMemoriesContent
      anniversaries={getAnniversaries(anniversariesQuery.data)}
    />
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
    navigation.goHome({ replace: true });
  }, [navigation]);

  return <CalendarMemoriesLoadingState />;
}

function getAnniversaries(anniversaries?: Anniversary[]) {
  if (!anniversaries) return [];

  return anniversaries;
}
