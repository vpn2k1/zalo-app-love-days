import { AppStatusBar } from "@/components/AppStatusBar";
import { Page } from "@/components/zaui";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import type { Anniversary } from "@/types/anniversary";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CalendarMemoriesGrid } from "./items/CalendarMemoriesGrid";
import { CalendarMemoriesHeader } from "./items/CalendarMemoriesHeader";
import { CalendarSheet } from "./items/CalendarSheet";
import { CalendarMemory } from "./items/CalendarMemory";
import { useCoupleData } from "@/hooks/useCoupleData";

export type TCalendarMemoriesPage = {
  selectDate: Date | null;
  viewDate: Date | null;
  anniversaries: Anniversary[];
  coupleId?: String;
};

export function CalendarMemoriesPage() {
  const { coupleData } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData(
    coupleData?.couple.id ?? "",
  );
  const method = useForm<TCalendarMemoriesPage>({
    defaultValues: {
      selectDate: new Date(),
      viewDate: new Date(),
      anniversaries: [],
    },
  });
  useEffect(() => {
    if (anniversariesQuery?.data) {
      method.setValue("anniversaries", anniversariesQuery?.data);
    }
    if (coupleData?.couple.id) {
      method.setValue("coupleId", coupleData?.couple.id);
    }
  }, [anniversariesQuery, coupleData]);

  return (
    <FormProvider {...method}>
      <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[calc(34px+env(safe-area-inset-bottom))] pt-4 text-[#3c2435] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <AppStatusBar />
        <CalendarMemoriesHeader />
        <CalendarMemoriesGrid />
        <CalendarMemory />
        <CalendarSheet />
      </Page>
    </FormProvider>
  );
}
