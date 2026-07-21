import { useQuery } from "@tanstack/react-query";

import { musicQueryKey } from "@/config/queryKeys";
import { musicService } from "@/services/musicService";

export function useMusicQuery(coupleId?: string) {
  return useQuery({
    queryKey: musicQueryKey(coupleId),
    queryFn: () => musicService.getMusicUrl(coupleId!),
    enabled: Boolean(coupleId),
  });
}
