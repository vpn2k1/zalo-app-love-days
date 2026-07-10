import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { AppStatusBar } from "@/components/AppStatusBar";
import { Page } from "@/components/zaui";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import type { Anniversary } from "@/types/anniversary";
import { toDateInputValue } from "@/utils/date";

import { CalendarMemoriesGrid } from "./items/CalendarMemoriesGrid";
import { CalendarMemoriesHeader } from "./items/CalendarMemoriesHeader";
import { CalendarSheet } from "./items/CalendarSheet";
import { CalendarMemory } from "./items/CalendarMemory";
import { AnniversaryComposer } from "../home/items/AnniversaryComposer";
import { useAnniversaryMutation } from "../home/modules/useAnniversaryMutation";

export type TCalendarMemoriesPage = {
  selectDate: Date | null;
  viewDate: Date | null;
  anniversaries: Anniversary[];
  coupleId?: string;
};

export function CalendarMemoriesPage() {
  const [composerVisible, setComposerVisible] = useState(false);
  const navigation = useAppNavigation();
  const { coupleData } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData(
    coupleData?.couple.id ?? "",
  );
  const addAnniversaryMutation = useAnniversaryMutation();
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
  const selectedDate = method.watch("selectDate");
  const selectedDateValue = getSelectedDateValue(selectedDate);
  const openComposer = () => {
    setComposerVisible(true);
  };
  const closeComposer = () => {
    setComposerVisible(false);
  };

  return (
    <FormProvider {...method}>
      <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[calc(34px+env(safe-area-inset-bottom))] pt-4 text-[#3c2435] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <AppStatusBar />
        <CalendarMemoriesHeader onBack={navigation.goBack} />
        <CalendarMemoriesGrid />
        <CalendarMemory onCreate={openComposer} />
        <CalendarSheet />
        <AnniversaryComposer
          defaultDate={selectedDateValue}
          lockDate
          loading={addAnniversaryMutation.isPending}
          visible={composerVisible}
          onAdd={(draft) => addAnniversaryMutation.mutateAsync(draft)}
          onClose={closeComposer}
        />
      </Page>
    </FormProvider>
  );
}

function getSelectedDateValue(selectedDate: Date | null) {
  if (!selectedDate) return "";

  return toDateInputValue(selectedDate);
}
