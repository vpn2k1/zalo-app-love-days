import { useQuery } from "@tanstack/react-query";
import { coupleQueryKey } from "@/config/queryKeys";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";

export function useCoupleData() {
  const { user } = useCurrentUser();
  const coupleQuery = useQuery({
    queryKey: coupleQueryKey(user?.id),
    queryFn: () => coupleService.getCoupleByUser(user!.id),
    enabled: Boolean(user),
  });

  return {
    coupleData: coupleQuery.data ?? null,
    coupleQuery,
  };
}
