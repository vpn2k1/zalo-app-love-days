import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import type { AppSheetRef } from "@/components/zaui";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useUpdateCoupleMutation } from "@/hooks/mutations/useUpdateCoupleMutation";
import type { CalendarDateValue } from "@/types/date";
import { todayDateString } from "@/utils/date";

import type {
  DaysTogetherFormValues,
  ElapsedTime,
} from "../types/HomePageType";

const EMPTY_ELAPSED_TIME: ElapsedTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function useDaysTogether() {
  const { coupleData } = useCoupleData();
  const persistedStartDate = getCalendarDateValue(
    coupleData?.couple.start_date,
  );
  const persistedBackground = coupleData?.couple.background_url || "";
  const sheetRef = useRef<AppSheetRef>(null);
  const [elapsed, setElapsed] = useState(EMPTY_ELAPSED_TIME);
  const updateCouple = useUpdateCoupleMutation();
  const { control, formState, handleSubmit, reset } =
    useForm<DaysTogetherFormValues>({
      defaultValues: getFormValues(persistedBackground, persistedStartDate),
    });
  const startDate = useWatch<DaysTogetherFormValues, "startDate">({
    control,
    name: "startDate",
    exact: true,
    defaultValue: persistedStartDate,
  });
  const startTime = useMemo(() => getStartTime(startDate), [startDate]);

  useEffect(() => {
    reset(getFormValues(persistedBackground, persistedStartDate));
  }, [persistedBackground, persistedStartDate, reset]);

  useEffect(() => {
    if (!startTime) return;

    const tick = () => setElapsed(getElapsedTime(startTime));
    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => window.clearInterval(intervalId);
  }, [startTime]);

  const closeSheet = () => sheetRef.current?.close();
  const openSheet = () => {
    reset(getFormValues(persistedBackground, persistedStartDate));
    sheetRef.current?.open();
  };
  const save = handleSubmit(async (values) => {
    if (!formState.isDirty || !coupleData) {
      closeSheet();
      return;
    }

    const payload = getUpdatePayload(values, coupleData.couple);
    const updatedCouple = await updateCouple.mutateAsync(payload);
    if (!updatedCouple) return;

    reset(
      getFormValues(
        updatedCouple.background_url || "",
        getCalendarDateValue(updatedCouple.start_date),
      ),
    );
    closeSheet();
  });

  return {
    closeSheet,
    control,
    disabled: !formState.isDirty,
    elapsed,
    loading: updateCouple.isPending,
    openSheet,
    save,
    sheetRef,
    startDate,
  };
}

function getFormValues(background: string, startDate: CalendarDateValue) {
  return { background, startDate };
}

function getStartTime(startDate: string) {
  if (!startDate) return null;

  const [year, month, day] = startDate.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function getElapsedTime(startTime: number): ElapsedTime {
  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  const hourInMilliseconds = 60 * 60 * 1000;
  const minuteInMilliseconds = 60 * 1000;
  const difference = Math.max(0, Date.now() - startTime);
  const remainingDay = difference % dayInMilliseconds;
  const remainingHour = remainingDay % hourInMilliseconds;

  return {
    days: Math.floor(difference / dayInMilliseconds),
    hours: Math.floor(remainingDay / hourInMilliseconds),
    minutes: Math.floor(remainingHour / minuteInMilliseconds),
    seconds: Math.floor((remainingHour % minuteInMilliseconds) / 1000),
  };
}

function getUpdatePayload(
  values: DaysTogetherFormValues,
  couple: { start_date: string; background_url?: string | null },
) {
  const payload: { startDate?: string; backgroundUrl?: string | null } = {};
  if (values.startDate !== getCalendarDateValue(couple.start_date)) {
    payload.startDate = values.startDate;
  }
  if (values.background === (couple.background_url || "")) return payload;

  payload.backgroundUrl = values.background || null;
  return payload;
}

function getCalendarDateValue(value?: string): CalendarDateValue {
  if (!value) return todayDateString();

  const dateValue = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue as CalendarDateValue;
  }

  return todayDateString();
}
