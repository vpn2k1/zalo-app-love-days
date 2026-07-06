import { useQuery } from "@tanstack/react-query";
import { anniversaryService } from "@/services/anniversaryService";
import { coupleService } from "@/services/coupleService";
import type { AppUser } from "@/types/user";
import { anniversariesQueryKey, coupleQueryKey } from "@/config/queryKeys";

type Input = {
  user: AppUser | null;
};

export function useLoveDaysData({ user }: Input) {
  const coupleQuery = useQuery({
    queryKey: coupleQueryKey(user?.id),
    queryFn: () => coupleService.getCoupleByUser(user!.id),
    enabled: Boolean(user),
  });
  const coupleData = coupleQuery.data ?? null;
  const anniversariesQuery = useQuery({
    queryKey: anniversariesQueryKey(coupleData?.couple.id),
    queryFn: () => anniversaryService.list(coupleData!.couple.id),
    enabled: Boolean(coupleData),
  });

  return { anniversariesQuery, coupleData, coupleQuery };
}
