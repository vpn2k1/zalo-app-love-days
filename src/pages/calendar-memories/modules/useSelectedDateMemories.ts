import { useQuery } from "@tanstack/react-query";

import { anniversariesByDateQueryKey } from "@/config/queryKeys";
import { anniversaryService } from "@/services/anniversaryService";
import { toDateInputValue } from "@/utils/date";

export function useSelectedDateMemories(
  coupleId: string | undefined,
  selectedDate: Date | null,
) {
  const selectedDateValue = getSelectedDateValue(selectedDate);
  const memoriesQuery = useQuery({
    queryKey: anniversariesByDateQueryKey(coupleId, selectedDateValue),
    queryFn: () => anniversaryService.listByDate(coupleId ?? "", selectedDateValue),
    enabled: Boolean(coupleId && selectedDateValue),
  });

  return {
    memories: memoriesQuery.data ?? [],
    memoriesQuery,
    selectedDateValue,
  };
}

function getSelectedDateValue(selectedDate: Date | null) {
  if (!selectedDate) return "";

  return toDateInputValue(selectedDate);
}
