import { useLayoutEffect } from "react";
import { Tabs } from "zmp-ui";

import { AppPageHeader } from "@/components/AppPageHeader";
import { AppStatusBar } from "@/components/AppStatusBar";
import { Page, useNavigate } from "@/components/zaui";
import { LegalPageContent } from "./items/LegalPageContent";
import { legalPages } from "./modules/legalPages";
import type { LegalPageKind } from "./types/LegalPageType";
import { LegalPageDonate } from "./items/LegalPageDonate";

type Props = {
  kind: LegalPageKind;
};

export function LegalPage({ kind }: Props) {
  const navigate = useNavigate();
  useLegalTabAutoScroll(kind);

  return (
    <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[34px] pt-4 text-[#3c2435]">
      <AppStatusBar />
      <AppPageHeader
        title="Pháp lý"
        subtitle="Thông tin pháp lý của ứng dụng"
        onBack={() => navigate(-1)}
      />
      <Tabs
        className="app-legal-tabs bg-white"
        id="legal-tabs"
        defaultActiveKey={kind}
        scrollable
      >
        <Tabs.Tab key="terms" label="Điều khoản">
          <LegalPageContent page={legalPages.terms} />
        </Tabs.Tab>
        <Tabs.Tab key="privacy" label="Riêng tư">
          <LegalPageContent page={legalPages.privacy} />
        </Tabs.Tab>
        <Tabs.Tab key="data-deletion" label="Xóa dữ liệu">
          <LegalPageContent page={legalPages["data-deletion"]} />
        </Tabs.Tab>
        <Tabs.Tab key="donate" label="Ủng hộ">
          <LegalPageDonate />
        </Tabs.Tab>
      </Tabs>
    </Page>
  );
}

function useLegalTabAutoScroll(kind: LegalPageKind) {
  useLayoutEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const activeTab = document.querySelector<HTMLElement>(
        ".app-legal-tabs .zaui-tabs-tabbar-item-active",
      );
      if (!activeTab) return;

      activeTab.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "center",
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [kind]);
}
