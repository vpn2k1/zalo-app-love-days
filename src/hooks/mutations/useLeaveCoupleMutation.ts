import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppSnackbar } from "@/components/zaui";
import {
  allAnniversariesQueryKey,
  coupleQueryKey,
  infiniteAnniversariesQueryKey,
} from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { setCurrentUserCache } from "@/hooks/useCurrentUser";
import { currentUserStore } from "@/services/currentUserStore";
import { leaveSpaceService } from "@/services/leaveSpaceService";

export function useLeaveCoupleMutation() {
  const queryClient = useQueryClient();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: async () => {
      const user = currentUserStore.get();
      if (!coupleData || !user) throw new Error("Không tìm thấy.");

      await leaveSpaceService.leave({ coupleData, user });
    },
    onSuccess: async () => {
      const user = currentUserStore.get();
      if (!user) return;

      await queryClient.invalidateQueries({
        queryKey: coupleQueryKey(user.id),
      });
      queryClient.removeQueries({
        queryKey: allAnniversariesQueryKey(coupleData?.couple.id),
      });
      queryClient.removeQueries({
        queryKey: infiniteAnniversariesQueryKey(coupleData?.couple.id),
      });
      setCurrentUserCache(queryClient, null);
      navigation.goPermission({ replace: true });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể rời khỏi. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
