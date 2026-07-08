import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { anniversariesQueryKey, coupleQueryKey } from "@/config/queryKeys";

export function useLeaveCoupleMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: async () => {
      if (!coupleData) throw new Error("Không tìm thấy.");
      await coupleService.leaveCouple(coupleData.couple.id);
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
      queryClient.removeQueries({
        queryKey: anniversariesQueryKey(coupleData?.couple.id),
      });
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
