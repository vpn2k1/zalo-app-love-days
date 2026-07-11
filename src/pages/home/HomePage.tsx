import { HomePageContent } from "./items/HomePageContent";
import {
  HomePageLoadingState,
  HomePageMissingCoupleState,
} from "./items/HomePageStates";
import { useHomePageController } from "./modules/useHomePageController";

export function HomePage() {
  const home = useHomePageController();
  if (home.loading) return <HomePageLoadingState />;
  if (!home.contentProps) return <HomePageMissingCoupleState />;

  return <HomePageContent {...home.contentProps} />;
}
