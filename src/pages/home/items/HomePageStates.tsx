import { useEffect } from "react";

import { AppSpinner, Box } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export function HomePageLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}

export function HomePageMissingCoupleState() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.goSetup({ replace: true });
  }, [navigation]);

  return <HomePageLoadingState />;
}
