import { type ReactNode } from "react";

import { AppStatusBar } from "@/components/AppStatusBar";
import { Page } from "@/components/zaui";

type Props = {
  children: ReactNode;
};

export function MemoryDetailFormShell({ children }: Props) {
  return (
    <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[calc(112px+env(safe-area-inset-bottom))] pt-4 text-[#3c2435] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <AppStatusBar />
      {children}
    </Page>
  );
}
