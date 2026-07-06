import { useMemo, useState } from "react";
import { useAppSnackbar } from "@/components/zaui";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import { diffInDays, getNextAnniversary } from "@/utils/date";
import type { HomePageContentProps } from "../types/HomePageType";

export function useHomePage({
  coupleData,
  anniversaries,
  onAddAnniversary,
  startDate,
}: Pick<
  HomePageContentProps,
  "coupleData" | "anniversaries" | "onAddAnniversary"
> & {
  startDate: string;
}) {
  const [showAnniversaryForm, setShowAnniversaryForm] = useState(false);
  const snackbar = useAppSnackbar();
  const couple = useMemo(
    () => ({ ...coupleData.couple, start_date: startDate }),
    [coupleData.couple, startDate],
  );
  const days = diffInDays(startDate);
  const nextAnniversary = useMemo(
    () => getNextAnniversary(couple, anniversaries),
    [anniversaries, couple],
  );
  const visibleAnniversaries = useMemo(
    () => getNewestAnniversaries(anniversaries),
    [anniversaries],
  );

  const addAnniversary = async (draft: AnniversaryDraft) => {
    try {
      await onAddAnniversary(draft);
      snackbar.showSuccess("Đã thêm ngày kỷ niệm.");
      setShowAnniversaryForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    addAnniversary,
    days,
    nextAnniversary,
    setShowAnniversaryForm,
    showAnniversaryForm,
    visibleAnniversaries,
  };
}

function getNewestAnniversaries(anniversaries: Anniversary[]) {
  return [...anniversaries]
    .sort(compareAnniversaryDateDesc)
    .slice(0, 5);
}

function compareAnniversaryDateDesc(left: Anniversary, right: Anniversary) {
  return getDateTime(right.date) - getDateTime(left.date);
}

function getDateTime(value: string) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return 0;

  return time;
}
