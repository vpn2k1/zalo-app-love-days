import { allAnniversariesQueryKey } from "@/config/queryKeys";
import { anniversaryService } from "@/services/anniversaryService";
import { useQuery } from "@tanstack/react-query";

export function useAnniversariesData(id: string) {
  const anniversariesQuery = useQuery({
    queryKey: allAnniversariesQueryKey(id),
    queryFn: () => anniversaryService.list(id),
    enabled: Boolean(id),
  });

  return { anniversaries: anniversariesQuery.data ?? [], anniversariesQuery };
}
