import { anniversariesQueryKey } from "@/config/queryKeys";
import { anniversaryService } from "@/services/anniversaryService";
import { useQuery } from "@tanstack/react-query";

export function useAnniversariesData(id: string) {
  const anniversariesQuery = useQuery({
    queryKey: anniversariesQueryKey(id),
    queryFn: () => anniversaryService.list(id),
    enabled: !!id,
  });

  return { anniversariesQuery };
}
