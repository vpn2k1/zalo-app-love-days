import { FormProvider } from "react-hook-form";

import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";

import { useHomeDisplayForm } from "../modules/useHomeDisplayForm";
import { HomePageProvider } from "../modules/useHomePageContext";
import type { HomePageContentProps } from "../types/HomePageType";
import { HomePageBody } from "./HomePageBody";

export function HomePageContent(props: HomePageContentProps) {
  const methods = useHomeDisplayForm(props);

  return (
    <HomePageProvider value={props}>
      <FormProvider {...methods}>
        <BlockingLoadingOverlay
          show={Boolean(props.blockingMessage)}
          message={props.blockingMessage || "Äang lÆ°u thay Ä‘á»•i..."}
        />
        <HomePageBody />
      </FormProvider>
    </HomePageProvider>
  );
}
