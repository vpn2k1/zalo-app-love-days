import { anniversaryService } from "@/services/anniversaryService";
import { useQuery } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";

export function useGetMemory() {
  const date = useWatch({
    name: "selectDate",
    exact: true,
  });
  const coupleId = useWatch({
    name: "coupleId",
    exact: true,
  });
  console.log(date.toISOString());
  
  return useQuery({
    queryKey: ["memory", coupleId, date],
    queryFn: () => anniversaryService.findOne(coupleId, date),
    enabled: !!coupleId && !!date,
  });
}
