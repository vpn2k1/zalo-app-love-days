import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { anniversariesQueryKey, coupleQueryKey } from "@/config/queryKeys";

export function useUpdateStartDateMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();

  return useMutation({
    mutationFn: async (startDate: string) => {
      if (!coupleData) throw new Error("Không tìm thấy.");
      return coupleService.updateCoupleStartDate(coupleData.couple.id, startDate);
    },
    onSuccess: async () => {
      if (!user) return;
      if (!coupleData) return;

      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(coupleData.couple.id),
      });
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
