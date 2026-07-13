import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useCoupleData } from "@/hooks/useCoupleData";
import { coupleService } from "@/services/coupleService";
import { currentUserStore } from "@/services/currentUserStore";
import {
  allAnniversariesQueryKey,
  coupleQueryKey,
  infiniteAnniversariesQueryKey,
} from "@/config/queryKeys";

export function useUpdateStartDateMutation() {
  const queryClient = useQueryClient();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();

  return useMutation({
    mutationFn: async (startDate: string) => {
      if (!coupleData) throw new Error("Không tìm thấy.");
      return coupleService.updateCoupleStartDate(coupleData.couple.id, startDate);
    },
    onSuccess: async () => {
      const user = currentUserStore.get();
      if (!user) return;
      if (!coupleData) return;

      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: allAnniversariesQueryKey(coupleData.couple.id),
        }),
        queryClient.invalidateQueries({
          queryKey: infiniteAnniversariesQueryKey(coupleData.couple.id),
        }),
      ]);
      await queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể cập nhật ngày bắt đầu. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
