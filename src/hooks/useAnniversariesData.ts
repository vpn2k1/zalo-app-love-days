import { useQuery } from "@tanstack/react-query";
import { anniversariesQueryKey } from "@/config/queryKeys";
import { useCoupleData } from "@/hooks/useCoupleData";
import { anniversaryService } from "@/services/anniversaryService";

export function useAnniversariesData() {
  const { coupleData } = useCoupleData();
  const anniversariesQuery = useQuery({
    queryKey: anniversariesQueryKey(coupleData?.couple.id),
    queryFn: () => anniversaryService.list(coupleData!.couple.id),
    enabled: Boolean(coupleData),
  });

  return { anniversariesQuery };
}
