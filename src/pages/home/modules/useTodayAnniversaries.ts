import { useQuery } from "@tanstack/react-query";

import { anniversariesByDateQueryKey } from "@/config/queryKeys";
import { anniversaryService } from "@/services/anniversaryService";
import { todayDateString } from "@/utils/date";

export function useTodayAnniversaries(coupleId: string) {
  const today = todayDateString();
  const todayAnniversariesQuery = useQuery({
    queryKey: anniversariesByDateQueryKey(coupleId, today),
    queryFn: () => anniversaryService.listByDate(coupleId, today),
    enabled: Boolean(coupleId),
  });

  return {
    todayAnniversaries: todayAnniversariesQuery.data ?? [],
    todayAnniversariesQuery,
  };
}
