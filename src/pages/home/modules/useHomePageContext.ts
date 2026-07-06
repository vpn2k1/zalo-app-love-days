import { createContext, useContext } from "react";
import type { HomePageContentProps } from "../types/HomePageType";

const HomePageContext = createContext<HomePageContentProps | null>(null);

export const HomePageProvider = HomePageContext.Provider;

export function useHomePageContext() {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error("useHomePageContext must be used inside HomePageProvider");
  }

  return context;
}
