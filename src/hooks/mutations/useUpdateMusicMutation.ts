import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppSnackbar } from "@/components/zaui";
import { coupleQueryKey, musicQueryKey } from "@/config/queryKeys";
import { useCoupleData } from "@/hooks/useCoupleData";
import { currentUserStore } from "@/services/currentUserStore";
import { musicService } from "@/services/musicService";
import type { CoupleWithMembers } from "@/types/couple";

export function useUpdateMusicMutation() {
  const queryClient = useQueryClient();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();

  return useMutation({
    mutationFn: (file: File | null) => {
      if (!coupleData) throw new Error("Không tìm thấy Nhật ký tình yêu.");

      return musicService.updateMusic(coupleData.couple.id, file);
    },
    onSuccess: async (updatedCouple) => {
      const user = currentUserStore.get();
      if (!user) return;
      if (!coupleData) return;

      queryClient.setQueryData<CoupleWithMembers>(coupleQueryKey(user.id), {
        ...coupleData,
        couple: updatedCouple,
      });
      queryClient.setQueryData(
        musicQueryKey(updatedCouple.id),
        updatedCouple.mp3_url ?? null,
      );
      await queryClient.invalidateQueries({
        queryKey: musicQueryKey(updatedCouple.id),
      });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể cập nhật nhạc. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
