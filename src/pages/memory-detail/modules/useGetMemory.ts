import { useCoupleData } from "@/hooks/useCoupleData";
import { anniversaryService } from "@/services/anniversaryService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "zmp-ui";

export function useGetMemory() {
  const [searchParams] = useSearchParams();
  const memoryId = searchParams.get("id");
  const { coupleData } = useCoupleData();
  const coupleId = coupleData?.couple.id;

  return useQuery({
    queryKey: ["get-memory", coupleId, memoryId],
    queryFn: () =>
      anniversaryService.getOne({
        coupleId: coupleId ?? "",
        id: memoryId ?? "",
      }),
    enabled: Boolean(memoryId && coupleId),
  });
}
