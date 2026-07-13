import { FormProvider } from "react-hook-form";

import { HomePageBody } from "./items/HomePageBody";
import {
  HomePageLoadingState,
  HomePageMissingCoupleState,
} from "./items/HomePageStates";
import { useFormValuesHome } from "./modules/useFormValuesHome";

export function HomePage() {
  const home = useFormValuesHome();
  if (home.loading) return <HomePageLoadingState />;
  if (!home.user || !home.coupleData) return <HomePageMissingCoupleState />;

  return (
    <FormProvider {...home.forms}>
      <HomePageBody />
    </FormProvider>
  );
}
