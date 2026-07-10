import { anniversaryService } from "@/services/anniversaryService";
import { toDateInputValue } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";

import type { TCalendarMemoriesPage } from "../CalendarMemoriesPage";

export function useGetMemory() {
  const date = useWatch<TCalendarMemoriesPage, "selectDate">({
    name: "selectDate",
    exact: true,
  });
  const coupleId = useWatch<TCalendarMemoriesPage, "coupleId">({
    name: "coupleId",
    exact: true,
  });
  const dateValue = getDateValue(date);

  return useQuery({
    queryKey: ["memory", coupleId, dateValue],
    queryFn: () => {
      if (!coupleId || !date) throw new Error("Thiếu ngày kỷ niệm.");

      return anniversaryService.findOne(coupleId, date);
    },
    enabled: !!coupleId && !!date,
  });
}

function getDateValue(date: Date | null) {
  if (!date) return "";

  return toDateInputValue(date);
}
