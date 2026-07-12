import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { anniversaryService } from "@/services/anniversaryService";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "zmp-ui";

export function useGetMemory() {
  const [searchParams] = useSearchParams();
  const memoryId = searchParams.get("id");
  
  const { coupleData } = useCoupleData();
  return useQuery({
    queryKey: ["get-memory", memoryId],
    queryFn: () =>
      anniversaryService.getOne({
        coupleId: coupleData?.couple.id as string,
        id: memoryId as string,
      }),
    enabled: !!memoryId || !!coupleData?.couple.id,
  });
}
