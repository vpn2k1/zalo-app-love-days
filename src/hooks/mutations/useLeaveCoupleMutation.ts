import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppSnackbar } from "@/components/zaui";
import {
  anniversariesQueryKey,
  coupleQueryKey,
  currentUserQueryKey,
} from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { leaveSpaceService } from "@/services/leaveSpaceService";

export function useLeaveCoupleMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: async () => {
      if (!coupleData || !user) throw new Error("Không tìm thấy.");

      await leaveSpaceService.leave({ coupleData, user });
    },
    onSuccess: async () => {
      if (!user) return;

      await queryClient.invalidateQueries({
        queryKey: coupleQueryKey(user.id),
      });
      queryClient.removeQueries({
        queryKey: anniversariesQueryKey(coupleData?.couple.id),
      });
      queryClient.setQueryData(currentUserQueryKey(), null);
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
