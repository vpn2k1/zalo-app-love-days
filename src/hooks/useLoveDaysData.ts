import { useQuery } from "@tanstack/react-query";
import { coupleService } from "@/services/coupleService";
import type { AppUser } from "@/types/user";
import { coupleQueryKey } from "@/config/queryKeys";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";

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
  const { anniversaries, anniversariesQuery } = useAnniversariesData(
    coupleData?.couple.id ?? "",
  );

  return { anniversaries, anniversariesQuery, coupleData, coupleQuery };
}
